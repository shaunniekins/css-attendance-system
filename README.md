# Next.js PWA Project

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Adding PWA Functionality: Installability

1. Install the `next-pwa` package:

```bash
npm i @ducanh2912/next-pwa
```

2. Update next.config.js:

```
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
};

module.exports = withPWA(nextConfig);

```

3. Create or update public/manifest.json:

```
{
  "id": "CSS Attendance App",
  "name": "Next.js PWA - Tutorial",
  "short_name": "Next PWA",
  "description": "This next.js app is a PWA.",
  "icons": [
    {
      "src": "/LCO Logo.svg",
      "sizes": "72x72",
      "type": "image/svg"
    },
    {
      "src": "/LCO Logo.svg",
      "sizes": "192x192",
      "type": "image/svg"
    },
    {
      "src": "/LCO Logo.svg",
      "sizes": "384x384",
      "type": "image/svg"
    },
    {
      "src": "/LCO Logo.svg",
      "sizes": "512x512",
      "type": "image/svg"
    }
  ],
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "start_url": "/",
  "scope": ".",
  "display": "standalone",
  "orientation": "portrait"
}

```

4. Update src/app/layout.tsx to include the following:

```
const APP_NAME = "CSS Attendance System";
const APP_DEFAULT_TITLE = "CSS Attendance System";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "PWA App for CSS Attendance System";

export const metadata: Metadata = {
 manifest: "/manifest.json",
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
```
