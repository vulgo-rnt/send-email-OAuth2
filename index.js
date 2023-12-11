import {
  startWebServer,
  createOAuthClient,
  requestUserConsent,
  waitForGoogleCallback,
  requestGoogleForAccessTokens,
} from "./connectGoogle.js";

async function init() {
  const webServer = await startWebServer();
  const OAuthClient = await createOAuthClient();
  requestUserConsent(OAuthClient);
  const authorizationToken = await waitForGoogleCallback(webServer);
  await requestGoogleForAccessTokens(OAuthClient, authorizationToken);
  await setGlobalGoogleAuthentication(OAuthClient);
}

init();
