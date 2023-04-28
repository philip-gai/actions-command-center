import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OAuthApp } from "@octokit/oauth-app";
import { env } from "process";
import { GitHubAppUserAuthenticationWithExpiration } from "@octokit/auth-oauth-app";

// Test by going to https://github.com/login/oauth/authorize?client_id=Iv1.f3cd5e26efa9f14f
export async function getGitHubAccessToken(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const code = request.query.get('code');
    if (!code) {
        context.error(`Missing code`);
        return { status: 400, body: "Missing code" };
    }

    const clientId = env["GITHUB_CLIENT_ID"];
    const clientSecret = env["GITHUB_CLIENT_SECRET"];

    if (!clientId || !clientSecret) {
        context.error(`Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET`);
        return { status: 500, body: "Missing GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET" };
    }

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
    authWithExpiration.clientSecret = 'REDACTED';

    const jsonBody = authWithExpiration as any;
    jsonBody.message = 'Successfully authenticated with GitHub';

    context.log(`Token (Last 9): ${authWithExpiration.token.slice(-9)}`);

    const response: HttpResponseInit = { jsonBody };
    return response;
};

app.http('getGitHubAccessToken', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getGitHubAccessToken,
    route: 'github/login/oauth/access_token'
});
