# Generative UI with React Server Components and Vercel AI SDK

🚀 ReplyRadar scans your curated X lists every 5 min, filters engagement-bait, and sends a twice-daily digest of fresh (<2 h) tweets matched to your interests—each with an AI-drafted opener—so you can spark 50 high-value convos in just 30 min a week.

> **Note**: Development of AI SDK RSC is currently paused. For more information, see [Migrating from AI SDK RSC](https://sdk.vercel.ai/docs/ai-sdk-rsc/migrating-to-ui#background).

This example demonstrates how to use the [Vercel AI SDK](https://sdk.vercel.ai/docs) with [Next.js](https://nextjs.org/) and the `streamUI` function to create generative user interfaces by streaming React Server Components to the client.

## Features

- Interactive chat demo powered by the Vercel AI SDK and React Server Components.
- Example home automation tools including camera, hub and usage views.
- Polling worker that uses [twitterapi.io](https://twitterapi.io) to fetch tweets from your curated lists or bellwether accounts and store them in a local SQLite database.
- Uses only `npm` for package management.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Fai-sdk-preview-rsc-genui&env=OPENAI_API_KEY&envDescription=API%20keys%20needed%20for%20application&envLink=platform.openai.com)

## How to use

Run [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) with [npm](https://docs.npmjs.com/cli/init) to bootstrap the example:

```bash
npx create-next-app --example https://github.com/vercel-labs/ai-sdk-preview-rsc-genui ai-sdk-preview-rsc-genui-example
```

To run the example locally you need to:

1. Sign up for accounts with the AI providers you want to use (e.g., OpenAI, Anthropic).
2. Obtain API keys for each provider.
3. Set the required environment variables as shown in the `.env.example` file, but in a new file called `.env`.
4. `npm install` to install the required dependencies.
5. `npm run dev` to launch the development server.


## Learn More

To learn more about Vercel AI SDK or Next.js take a look at the following resources:

- [Vercel AI SDK docs](https://sdk.vercel.ai/docs)
- [Vercel AI Playground](https://play.vercel.ai)
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

## Twitter polling worker

This repo includes a polling script to fetch tweets from lists or users. Create a `.env` file based on `.env.example` and run:

```bash
npm run poll
```

Tweets are stored in a local SQLite database configured by `DB_PATH`.
