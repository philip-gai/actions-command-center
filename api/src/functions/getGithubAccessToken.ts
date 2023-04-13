import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OAuthApp } from "@octokit/oauth-app";
import { env } from "process";
import { GitHubAppUserAuthenticationWithExpiration } from "@octokit/auth-oauth-app";

// Test by going to https://github.com/login/oauth/authorize?client_id=Iv1.f3cd5e26efa9f14f
export async function getGitHubAccessToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const code = request.query.get('code');

    const clientId = env["GITHUB_CLIENT_ID"];
    const clientSecret = env["GITHUB_CLIENT_SECRET"];

    context.log(`clientId: ${clientId}`);

    const app = new OAuthApp({
        clientType: "github-app",
        clientId,
        clientSecret
    });

    let authWithExpiration: GitHubAppUserAuthenticationWithExpiration;

    try {
        const { authentication } = await app.createToken({ code });
        authWithExpiration = authentication as GitHubAppUserAuthenticationWithExpiration;;
    } catch (error) {
        context.error(`Error when creating user token. Error response: ${JSON.stringify(error.response)}`);
        return { status: error.status, body: error.response.data.error_description };
    }

    // NEVER return this to the client
    delete authWithExpiration.clientSecret;

    context.log(`Token (Last 9): ${authWithExpiration.token.slice(-9)}`);

    const response: HttpResponseInit = { jsonBody: authWithExpiration };
    return response;
};

app.http('getGitHubAccessToken', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getGitHubAccessToken,
    route: 'github/login/oauth/access_token'
});
