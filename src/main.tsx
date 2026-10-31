import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { loadPage } from './loadPage';
import './index.css';
const root = document.getElementById('root')!;
const path = window.location.pathname;
async function start() {
const page = await loadPage(path);
if (!root.hasChildNodes()) {
  const { metadataFor } = await import('./data/metadata');
  const meta = metadataFor(path);
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  createRoot(root).render(<StrictMode><App path={path}>{page}</App></StrictMode>);
} else hydrateRoot(root, <StrictMode><App path={path}>{page}</App></StrictMode>);
}
void start();
