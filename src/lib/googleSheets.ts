import { getAccessToken, googleSignIn } from './firebase';

export interface LeadSubmission {
  formType: 'Get Started' | 'Send Us a Message' | 'Schedule Your Growth Session' | string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

export const SPREADSHEET_ID = '1quXpGKB7C-pq0vDXLmqyOWloYpfuB3oDgiWPO2oYAkE';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit?usp=sharing`;

const LOCAL_STORAGE_KEY = 'justgrow_leads_backup';
const APPS_SCRIPT_URL_KEY = 'justgrow_apps_script_url';

const DEFAULT_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyXGKTxAL_ssXhFqksd2M_8Ti3UZ4PId-JSCQ5Ejpf2ogQ58HoohKCdFL-AJfQEGbYP_w/exec';

function isValidUrl(urlString?: string): boolean {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function getAppsScriptUrl(): string {
  const saved = localStorage.getItem(APPS_SCRIPT_URL_KEY);
  if (saved && !isValidUrl(saved)) {
    localStorage.removeItem(APPS_SCRIPT_URL_KEY);
  } else if (saved && isValidUrl(saved)) {
    return saved;
  }

  const envUrl = (import.meta as any).env?.VITE_GOOGLE_APPS_SCRIPT_URL;
  if (envUrl && isValidUrl(envUrl)) {
    return envUrl;
  }

  return DEFAULT_APPS_SCRIPT_URL;
}

export function setAppsScriptUrl(url: string) {
  localStorage.setItem(APPS_SCRIPT_URL_KEY, url);
}

export function saveLeadLocally(lead: LeadSubmission) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    existing.push({ ...lead, timestamp: new Date().toISOString() });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save lead locally', e);
  }
}

export function getLocalLeads(): Array<LeadSubmission & { timestamp: string }> {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function sanitizeForSheets(str: string): string {
  if (!str) return '';
  const trimmed = str.trim();
  // Prepend single quote ' if string starts with +, =, -, @ so Google Sheets treats it as plain text instead of a formula
  if (/^[+=@-]/.test(trimmed)) {
    return `'${trimmed}`;
  }
  return trimmed;
}

export async function submitLeadToGoogleSheet(
  lead: LeadSubmission
): Promise<{ success: boolean; syncedToSheet: boolean; message?: string }> {
  const timestamp = new Date().toLocaleString('en-US', { timeZoneName: 'short' });
  const payload = {
    timestamp: sanitizeForSheets(timestamp),
    formType: sanitizeForSheets(lead.formType),
    fullName: sanitizeForSheets(lead.fullName || ''),
    email: sanitizeForSheets(lead.email || ''),
    phone: sanitizeForSheets(lead.phone || 'N/A'),
    company: sanitizeForSheets(lead.company || 'N/A'),
    service: sanitizeForSheets(lead.service || 'N/A'),
    preferredDate: sanitizeForSheets(lead.preferredDate ? `${lead.preferredDate} ${lead.preferredTime || ''}`.trim() : 'N/A'),
    message: sanitizeForSheets(lead.message || 'N/A')
  };

  // 1. Save copy locally first as backup
  saveLeadLocally(lead);

  // 2. Try server-side API proxy route first (most reliable, bypasses CORS/redirect restrictions)
  try {
    const apiRes = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.success) {
        return {
          success: true,
          syncedToSheet: true,
          message: 'Inquiry submitted successfully!'
        };
      }
    }
  } catch (apiErr) {
    console.warn('Server proxy /api/submit-lead unavailable, falling back to direct submit:', apiErr);
  }

  // 3. Fallback: Try direct Google Apps Script Web App URL from client
  const scriptUrl = getAppsScriptUrl();
  if (scriptUrl) {
    try {
      // Build FormData payload (most reliable for Google Apps Script e.parameter)
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => formData.append(k, String(v)));

      // Primary submission with FormData
      await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });

      // Secondary URLSearchParams fallback
      const formParams = new URLSearchParams();
      Object.entries(payload).forEach(([k, v]) => formParams.append(k, String(v)));
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formParams.toString()
      }).catch(() => {});

      // Tertiary JSON fallback
      fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      }).catch(() => {});

      return {
        success: true,
        syncedToSheet: true,
        message: 'Inquiry submitted successfully!'
      };
    } catch (err) {
      console.error('Error submitting via Apps Script Web App:', err);
    }
  }

  // 3. Try OAuth access token if admin is logged in
  const token = getAccessToken();
  if (token) {
    try {
      const rowValues = [
        payload.timestamp,
        payload.formType,
        payload.fullName,
        payload.email,
        payload.phone,
        payload.company,
        payload.service,
        payload.preferredDate,
        payload.message
      ];

      const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/A1:append?valueInputOption=USER_ENTERED`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ values: [rowValues] })
      });

      if (response.ok) {
        return {
          success: true,
          syncedToSheet: true,
          message: 'Inquiry saved successfully!'
        };
      }
    } catch (error) {
      console.error('Error submitting via Sheets API:', error);
    }
  }

  return {
    success: true,
    syncedToSheet: false,
    message: 'Inquiry received successfully!'
  };
}
