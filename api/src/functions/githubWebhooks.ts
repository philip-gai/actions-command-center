import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function githubWebhooks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    context.log(`Request body: ${JSON.stringify(request.body)}`);
    return { body: 'OK' };
};

app.http('githubWebhooks', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: githubWebhooks
});
