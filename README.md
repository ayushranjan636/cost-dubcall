# DubCall Rate Checker

A three-step pricing page (your details → requirements → your rates + PDF) that saves every visitor as a lead in Google Sheets. Built with React + Vite, plus one Vercel serverless function.

```
cost-dubcall/
├── index.html                 Vite entry (mounts the React app)
├── src/
│   ├── main.jsx               React root
│   ├── App.jsx                Wizard state, validation, step navigation
│   ├── data.js                All prices, use cases, plans and rate maths
│   ├── pdf.js                 jsPDF rate sheet (loaded only when downloading)
│   ├── lead.js                Posts leads to /api/lead
│   ├── index.css              Styles (light + dark)
│   └── components/            Header, DetailsForm, RequirementsForm, RatesPanel, PlansAside
├── public/logo.webp           DubCall logo
├── api/lead.js                Vercel function: validates the lead, forwards it to Google Sheets
├── apps-script/Code.gs        Google Apps Script that writes rows into the sheet
├── legacy/index.html          The original single-file HTML version (reference only)
├── vercel.json                Vite build settings and security headers
├── .env.example               The two environment variables you need
└── package.json
```

## How leads are saved

Each visitor gets one row in the `Leads` sheet, keyed by a Lead ID. The row is created when they submit their details and updated as they go further:

| Stage | When |
| --- | --- |
| Details submitted | Page 1 completed (captures drop-offs) |
| Rates viewed | Page 2 completed; use cases, volume, plan and rates are filled in |
| PDF downloaded | They downloaded the rate sheet; "PDF downloaded" becomes Yes |

The browser never sees the Google Sheets URL or secret: the page posts to `/api/lead`, and the function forwards it with the secret.

## Setup (about 15 minutes)

### 1. Google Sheet + Apps Script

1. Create a new Google Sheet, for example "DubCall Leads".
2. **Extensions → Apps Script**. Delete the sample code and paste everything from `apps-script/Code.gs`. Save.
3. **Project Settings (gear) → Script Properties → Add script property**
   - Property: `SHARED_SECRET`
   - Value: a long random string (e.g. run `openssl rand -hex 32` in Terminal). Keep it for step 2.
4. In the editor, choose the `setup` function and click **Run**. Approve the permissions. A `Leads` tab with headers appears.
5. **Deploy → New deployment → Select type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
6. Open that URL in a browser. You should see `{"ok":true,"service":"DubCall leads"}`.

> If you edit `Code.gs` later: **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. The URL stays the same.

### 2. Deploy to Vercel

**Option A: GitHub (recommended)**
1. Push this folder to a new GitHub repo.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Vite** (auto-detected; build `npm run build`, output `dist`).
3. Before deploying, open **Environment Variables** and add:
   - `SHEET_WEBHOOK_URL` = the `/exec` URL from step 1.5
   - `SHEET_SECRET` = the same value as `SHARED_SECRET`
4. Click **Deploy**.

**Option B: Vercel CLI**
```bash
cd cost-dubcall
npm i -g vercel
vercel login
vercel env add SHEET_WEBHOOK_URL production
vercel env add SHEET_SECRET production
vercel --prod
```

### 3. Use your own domain (optional)
Vercel → Project → **Settings → Domains** → add `rates.dubcall.com` (or similar) and create the CNAME record it shows at your DNS provider. Then link it from dubcall.com ("Check your rates").

### 4. Test
1. Open the live URL, fill page 1 with test details. Wait 2+ seconds before submitting (faster submissions are treated as bots).
2. A row appears in the `Leads` sheet with stage **Details submitted**.
3. Finish page 2 → stage becomes **Rates viewed** with use cases, plan and rates.
4. Download the PDF → **PDF downloaded = Yes**.

## Run locally
```bash
npm install
npm run dev                  # UI only, http://localhost:5173 (lead saving will 404, that's fine)

cp .env.example .env.local   # fill in the two values
npm run vercel-dev           # UI + /api/lead, http://localhost:3000
```

## Changing prices
All prices live in `src/data.js`:
- `UC`: each use case with `lo` (lowest rate, Scale plan) and `hi` (highest rate, Starter plan). Growth uses the average.
- `PLANS`: Starter ₹4,999, Growth ₹9,999, Scale ₹19,999 per month, with the call-volume ranges.
- `tierFor()`: the 10,000 and 50,000 calls/month cut-offs.
- `SALES_TIERS`: sales per-minute rates (₹7 → ₹6 → ₹5 → ₹4.5).

Update the matching wording in `PLANS[].blurb`, `components/RatesPanel.jsx`, `components/PlansAside.jsx` and the PDF terms in `src/pdf.js` if you change cut-offs or fees.

## Troubleshooting
| Symptom | Fix |
| --- | --- |
| No row in the sheet, browser console shows `Lead not saved 500` | `SHEET_WEBHOOK_URL` or `SHEET_SECRET` missing in Vercel. Add them and redeploy. |
| `Lead not saved 502` | Check Vercel → Project → Logs. "unauthorized" = secrets don't match. HTML response = the Apps Script deployment isn't set to "Anyone". |
| Sheet works but new columns are missing | You edited `Code.gs` without deploying a new version. |
| PDF button says the tool didn't load | The PDF code is a separate chunk loaded on click; a new deploy can invalidate an open tab. Reload the page. |

## Privacy
The page tells visitors their details will be used to contact them. Keep the sheet's sharing limited to your team; it stores names, emails, phones and IP addresses.
# cost-dubcall
