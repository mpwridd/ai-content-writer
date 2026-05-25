# AI Content Writer

A professional AI-powered content generation tool built with Next.js and the Vercel AI SDK. Generate blog posts, articles, social media content, emails, product descriptions, and newsletters using the Mimo V2.5 Pro model.

## Features

- 🖊️ 6 content types: Blog Post, Article, Social Media, Email, Product Description, Newsletter
- 🎨 Warm orange/amber themed UI
- ⚡ Streaming output for real-time generation
- 📋 Copy to clipboard
- 📊 Word count display
- 📝 Generation history (last 5)
- 🎯 Tone & length customization

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and add your API key:
```bash
cp .env.example .env.local
```

3. Run the development server:
```bash
npm run dev
```

## Environment Variables

- `OPENAI_API_KEY` - Your API key for the OpenAI-compatible endpoint
- `OPENAI_BASE_URL` - The base URL for the API (default: `https://api.openai.com/v1`)

## Deploy

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/ai-content-writer)
