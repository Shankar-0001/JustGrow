import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import { metadataFor } from './data/metadata';
import './index.css';
const root = document.getElementById('root')!;
const path = window.location.pathname;
if (!root.hasChildNodes()) {
  const meta = metadataFor(path);
  document.title = meta.title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
  createRoot(root).render(<StrictMode><App path={path}/></StrictMode>);
} else hydrateRoot(root, <StrictMode><App path={path}/></StrictMode>);
