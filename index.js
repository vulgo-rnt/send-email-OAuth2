import {
  startWebServer,
  createOAuthClient,
  requestUserConsent,
  waitForGoogleCallback,
  requestGoogleForAccessTokens,
  stopWebServer,
  sendEmail,
  setGlobalGoogleAuthentication,
} from "./connectGoogle.js";

async function init() {
  const webServer = await startWebServer();
  const OAuthClient = await createOAuthClient();
  requestUserConsent(OAuthClient);
  const authorizationToken = await waitForGoogleCallback(webServer);
  requestGoogleForAccessTokens(OAuthClient, authorizationToken);
  setGlobalGoogleAuthentication(OAuthClient);
  await stopWebServer(webServer);
  await sendEmail(OAuthClient);
}

init();
