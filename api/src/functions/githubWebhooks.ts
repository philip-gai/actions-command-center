import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { App } from "octokit";
import { env } from "process";

export async function githubWebhooks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const event = request.headers.get("X-GitHub-Event");
    const payload = await request.json() as any;
    context.log(`Received event ${event}`);
    context.log(payload);

    if (event === "workflow_dispatch") {
        const startTime = new Date();
        context.log(`Start time: ${startTime}`);

        const appId = env["GITHUB_APP_ID"];
        const appPk = env["GITHUB_APP_PRIVATE_KEY"];

        if (!appId || !appPk) {
            context.error(`Missing GITHUB_APP_ID or GITHUB_APP_PRIVATE_KEY`);
            return { status: 500, body: "Sorry, looks like we're running into some issues. Try again later." };
        }

        const app = new App({ appId, privateKey: appPk });

        const installKit = await app.getInstallationOctokit(payload.installation.id)

        // Wait a few seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        const workflowRunsResponse = await installKit.rest.actions.listWorkflowRunsForRepo({
            owner: payload.repository.owner.login,
            repo: payload.repository.name,
            status: 'waiting',
            event: 'workflow_dispatch',
            actor: payload.sender.login
        })
        console.log(workflowRunsResponse);
        const workflowRuns = workflowRunsResponse.data.workflow_runs;
        context.log(workflowRuns);
        const matches = workflowRuns.filter(run => {
            const runStarted = new Date(Date.parse(run.run_started_at));
            context.log(`Checking run started at ${runStarted}`);
            return run.workflow_url.endsWith(payload.workflow)
                // Started really close (within seconds) to the webhook being sent
                && runStarted.getTime() >= startTime.getTime() - 1000
        });
        if (matches.length === 0) {
            context.log(`No matching workflow runs found`);
            return { status: 200, body: 'OK' };
        } else {
            context.log(`Found ${matches.length} matching workflow runs`);
            return { status: 200, jsonBody: matches };
        }
    }

    return { body: 'OK' };
};

app.http('githubWebhooks', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: githubWebhooks
});
