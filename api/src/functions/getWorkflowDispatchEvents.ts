import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { App } from "octokit";
import { env } from "process";

export async function getWorkflowDispatchWebhooks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const repoId = +request.query.get('repository_id');
    if (!repoId) {
        context.error(`Missing repoId`);
        return { status: 400, body: "Missing repoId" };
    }

    const appId = env["GITHUB_APP_ID"];
    const appPk = env["GITHUB_APP_PRIVATE_KEY"];

    if (!appId || !appPk) {
        context.error(`Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY`);
        return { status: 500, body: "Sorry, looks like we're running into some issues. Try again later." };
    }

    const app = new App({ appId, privateKey: appPk });

    // TODO: Check that the user can access the repo

    const deliveries = await app.octokit.rest.apps.listWebhookDeliveries({ per_page: 100 });
    const webhooksForRepo = deliveries.data.filter(delivery => delivery.repository_id === repoId && delivery.event === 'workflow_dispatch');
    const workflowDispatchEventPromises = webhooksForRepo.map(async webhook => await app.octokit.rest.apps.getWebhookDelivery({ delivery_id: webhook.id }));
    const workflowDispatchEvents = (await Promise.all(workflowDispatchEventPromises)).map(response => {
        const data = response.data;
        const payload = data.request.payload;
        return {
            repository_id: data.repository_id,
            workflow: payload.workflow,
            inputs: payload.inputs,
            delivered_at: data.delivered_at,
        }
    });

    return { jsonBody: workflowDispatchEvents };
};

app.http('getWorkflowDispatchEvents', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getWorkflowDispatchWebhooks
});
