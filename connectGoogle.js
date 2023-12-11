import express from "express";
import { google } from "googleapis";
import credentials from "./credentials/auth.json" assert { type: "json" };

const OAuth2 = google.auth.OAuth2;

export async function startWebServer() {
  return new Promise((resolve, reject) => {
    const port = 3000;
    const app = express();

    const server = app.listen(port, () => {
      console.log(`Listening on http://localhost:${port}`);

      resolve({
        app,
        server,
      });
    });
  });
}

export async function createOAuthClient() {
  const OAuthClient = new OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    credentials.web.redirect_uris[0]
  );

  return OAuthClient;
}

export function requestUserConsent(OAuthClient) {
  const consentUrl = OAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/gmail.send"],
  });

  console.log(`Please give your consent: ${consentUrl}`);
}

export async function waitForGoogleCallback(webServer) {
  return new Promise((resolve, reject) => {
    console.log("Waiting for user consent...");

    webServer.app.get("/auth", (req, res) => {
      const authCode = req.query.code;
      console.log(`Consent given: ${authCode}`);

      res.send("<h1>Thank you!</h1><p>Now close this tab.</p>");
      resolve(authCode);
    });
  });
}
