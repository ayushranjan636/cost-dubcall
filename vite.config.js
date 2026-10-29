import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// `npm run dev` serves the React app only. Use `npm run vercel-dev` to also run /api/lead locally.
export default defineConfig({
  plugins: [react()],
});
