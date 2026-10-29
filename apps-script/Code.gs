/**
 * DubCall Rate Checker → Google Sheets
 *
 * Paste this into Extensions → Apps Script of your leads spreadsheet.
 * Project Settings → Script Properties → add SHARED_SECRET (same value as SHEET_SECRET in Vercel).
 * Deploy → New deployment → Web app → Execute as: Me → Who has access: Anyone.
 * Copy the /exec URL into Vercel as SHEET_WEBHOOK_URL.
 *
 * One row per visitor (Lead ID). The row is updated as they move from
 * "Details submitted" → "Rates viewed" → "PDF downloaded".
 */

const SHEET_NAME = 'Leads';
const TIMEZONE = 'Asia/Kolkata';

const COLUMNS = [
  ['Lead ID', 'leadId'],
  ['First seen', null],
  ['Last updated', null],
  ['Stage', 'stage'],
  ['Name', 'name'],
  ['Company', 'company'],
  ['Email', 'email'],
  ['Phone', 'phone'],
  ['Designation', 'designation'],
  ['City', 'city'],
  ['Industry', 'industry'],
  ['Company size', 'companySize'],
  ['Use cases', 'useCases'],
  ['Picked-up calls / month', 'callsPerMonth'],
  ['Sales minutes / month', 'salesMinutesPerMonth'],
  ['Plan', 'plan'],
  ['Plan fee (Rs, incl. GST)', 'planFee'],
  ['Rates shown', 'rates'],
  ['Call direction', 'callDirection'],
  ['System to connect', 'crm'],
  ['Languages', 'languages'],
  ['PDF downloaded', null],
  ['Page', 'page'],
  ['IP', 'ip'],
  ['User agent', 'userAgent']
];

// Higher number = further along. A later request never moves a lead backwards.
const STAGE_ORDER = { 'Details submitted': 1, 'Rates viewed': 2, 'PDF downloaded': 3 };

function doPost(e) {
  try {
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const secret = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!secret || body.secret !== secret) return json_({ ok: false, error: 'unauthorized' });

    const lead = body.lead || {};
    if (!lead.leadId) return json_({ ok: false, error: 'missing leadId' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      const now = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd HH:mm:ss');
      const found = sheet.getRange('A:A').createTextFinder(String(lead.leadId)).matchEntireCell(true).findNext();

      let rowIndex, existing = null;
      if (found) {
        rowIndex = found.getRow();
        existing = sheet.getRange(rowIndex, 1, 1, COLUMNS.length).getValues()[0];
      } else {
        rowIndex = sheet.getLastRow() + 1;
      }

      const row = COLUMNS.map(([header, key], i) => {
        const old = existing ? existing[i] : '';
        if (header === 'First seen') return old || now;
        if (header === 'Last updated') return now;
        if (header === 'PDF downloaded') return (lead.stage === 'PDF downloaded' || old === 'Yes') ? 'Yes' : 'No';
        if (header === 'Stage') {
          const oldRank = STAGE_ORDER[old] || 0, newRank = STAGE_ORDER[lead.stage] || 0;
          return newRank >= oldRank ? lead.stage : old;
        }
        const v = lead[key];
        return (v === undefined || v === '') ? old : v;
      });

      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
      return json_({ ok: true, row: rowIndex });
    } finally {
      lock.releaseLock();
    }
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

// Lets you open the /exec URL in a browser to check the deployment is live.
function doGet() {
  return json_({ ok: true, service: 'DubCall leads' });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(c => c[0]));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold').setBackground('#0B0B0B').setFontColor('#FFFFFF');
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Run this once from the editor to create the header row and approve permissions.
function setup() {
  getSheet_();
}
