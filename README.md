# LinkedIn Clone

A LinkedIn-inspired social networking app built with Next.js, MongoDB, Clerk, and Cloudinary.

## Demo

🔗 **Live Demo:** _Add your Vercel URL here_

## Features

- Clerk authentication
- Create posts with text, images, or videos
- Like and unlike posts
- Add and delete comments
- Search posts
- Delete your own posts and comments
- Responsive LinkedIn-style layout
- Cloudinary media uploads
- MongoDB persistence

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Clerk
- MongoDB Node.js Driver
- MongoDB Atlas
- Cloudinary
- Sonner

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file and add the required MongoDB, Clerk, and Cloudinary variables.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Deployment

The project is ready to be deployed on Vercel. Make sure all required environment variables are configured in the Vercel project settings.
