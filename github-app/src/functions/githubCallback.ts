import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { OAuthApp } from "@octokit/oauth-app";
import { env } from "process";

// Test by going to https://github.com/login/oauth/authorize?client_id=Iv1.f3cd5e26efa9f14f
export async function githubCallback(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const { authentication } = await app.createToken({ code });

    context.log(`Token (Last 9): ${authentication.token.slice(-9)}`);

    const response = { body: `Successfully authenticated!` };
    context.log(`Http function returning response: ${JSON.stringify(response)}`);
    return response;
};

app.http('githubCallback', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: githubCallback,
    route: 'github/callback'
});
