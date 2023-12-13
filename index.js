import {
  startWebServer,
  createOAuthClient,
  requestUserConsent,
  waitForGoogleCallback,
  requestGoogleForAccessTokens,
  setGlobalGoogleAuthentication,
  setPostEmailWebServer,
} from "./connectGoogle.js";

async function init() {
  const webServer = await startWebServer();
  const OAuthClient = await createOAuthClient();
  requestUserConsent(OAuthClient);
  const authorizationToken = await waitForGoogleCallback(webServer);
  requestGoogleForAccessTokens(OAuthClient, authorizationToken);
  setGlobalGoogleAuthentication(OAuthClient);
  await setPostEmailWebServer(webServer, OAuthClient);
}

init();
