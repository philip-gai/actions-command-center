import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function githubWebhooks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    const event = request.headers.get("X-GitHub-Event");
    const payload = await request.json() as any;
    context.log(`Event: ${event}`);
    context.log(`Payload: ${JSON.stringify(payload)}`);
    return { body: 'OK' };
};

app.http('githubWebhooks', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: githubWebhooks
});
