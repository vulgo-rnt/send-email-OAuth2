import {
  startWebServer,
  createOAuthClient,
  requestUserConsent,
  waitForGoogleCallback,
} from "./connectGoogle.js";

async function init() {
  const webServer = await startWebServer();
  const OAuthClient = await createOAuthClient();
  requestUserConsent(OAuthClient);
  const authorizationToken = await waitForGoogleCallback(webServer);
}

init();
