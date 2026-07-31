import express from "express";
import { spawn } from "node:child_process";
import path from "path";
import { createServer as createViteServer } from "vite";

const DEFAULT_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyXGKTxAL_ssXhFqksd2M_8Ti3UZ4PId-JSCQ5Ejpf2ogQ58HoohKCdFL-AJfQEGbYP_w/exec";

function isValidUrl(urlString?: string): boolean {
  if (!urlString) return false;
  try {
    const url = new URL(urlString);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeForSheets(str: any): string {
  if (str === null || str === undefined) return '';
  const s = String(str).trim();
  if (/^[+=@-]/.test(s)) {
    return `'${s}`;
  }
  return s;
}

function openBrowser(url: string): void {
  const [command, args] = process.platform === "win32"
    ? ["cmd", ["/c", "start", "", url]]
    : process.platform === "darwin"
      ? ["open", [url]]
      : ["xdg-open", [url]];

  const browser = spawn(command, args, { detached: true, stdio: "ignore" });
  browser.unref();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // Server-side submission route to proxy requests to Google Apps Script
  app.post("/api/submit-lead", async (req, res) => {
    try {
      const rawPayload = req.body || {};
      const payload: Record<string, any> = {};

      for (const key of Object.keys(rawPayload)) {
        if (key === 'scriptUrl') continue;
        if (typeof rawPayload[key] === 'string') {
          payload[key] = sanitizeForSheets(rawPayload[key]);
        } else {
          payload[key] = rawPayload[key];
        }
      }

      let scriptUrl = process.env.VITE_GOOGLE_APPS_SCRIPT_URL;

      if (!isValidUrl(scriptUrl)) {
        scriptUrl = DEFAULT_APPS_SCRIPT_URL;
      }

      if (payload?.scriptUrl && isValidUrl(payload.scriptUrl)) {
        scriptUrl = payload.scriptUrl;
      }

      console.log("Submitting lead to Google Apps Script URL:", scriptUrl);
      console.log("Payload:", payload);

      // Send JSON payload to Google Apps Script with redirect following
      const response = await fetch(scriptUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      const responseText = await response.text();
      console.log("Google Apps Script Response Status:", response.status);
      console.log("Google Apps Script Response Text:", responseText.slice(0, 300));

      return res.json({
        success: true,
        syncedToSheet: true,
        message: "Inquiry saved successfully!",
        scriptStatus: response.status,
      });
    } catch (error: any) {
      console.error("Error in /api/submit-lead proxy:", error);
      return res.status(500).json({
        success: false,
        syncedToSheet: false,
        error: error.message || "Failed to submit to Google Sheet",
      });
    }
  });

  const isDevelopment = process.env.NODE_ENV !== "production";

  // Vite middleware for development
  if (isDevelopment) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    const localUrl = `http://localhost:${PORT}`;
    console.log(`Server running on ${localUrl}`);
    if (isDevelopment) openBrowser(localUrl);
  });
}

startServer();
