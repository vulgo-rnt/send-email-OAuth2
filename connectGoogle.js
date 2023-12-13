import express from "express";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import "dotenv/config";

const OAuth2 = google.auth.OAuth2;
const stringCredentials = process.env.AUTH;
const credentials = JSON.parse(stringCredentials);

export async function startWebServer() {
  return new Promise((resolve, reject) => {
    const port = 3000;
    const app = express();

    app.use(express.json());

    const server = app.listen(port, () => {
      console.log(`>Listening on http://localhost:${port}`);

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

export function requestUserConsent(OAuthClient, webServer) {
  const consentUrl = OAuthClient.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
  });
  console.log(`>Please give your consent: ${consentUrl}`);
}

export async function waitForGoogleCallback(webServer) {
  return new Promise((resolve, reject) => {
    console.log(">Waiting for user consent...");

    webServer.app.get("/auth", (req, res) => {
      const authCode = req.query.code;
      res.send("<h1>Thank you!</h1><p>Now close this tab.</p>");
      resolve(authCode);
    });
  });
}

export async function requestGoogleForAccessTokens(
  OAuthClient,
  authorizationToken
) {
  return new Promise((resolve, reject) => {
    OAuthClient.getToken(authorizationToken, (error, tokens) => {
      if (error) {
        return reject(error);
      }

      console.log(">Access tokens received!");

      OAuthClient.setCredentials(tokens);
      resolve();
    });
  });
}

export function setGlobalGoogleAuthentication(OAuthClient) {
  google.options({
    auth: OAuthClient,
  });
}

export async function setPostEmailWebServer(webServer, auth) {
  return new Promise((resolve, reject) => {
    webServer.app.post("/send", (req, res) => {
      const { email, subject, text } = req.body;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          type: "OAuth2",
          user: process.env.EMAIL,
          clientId: auth._clientId,
          clientSecret: auth._clientSecret,
          refreshToken: auth.credentials.refresh_token,
          accessToken: auth.credentials.access_token,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: subject,
        text: `Email-received: ${email}, Message: ${text}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          console.log(">Email sent: " + info.response);
        }
        resolve();
      });
    });
  });
}
