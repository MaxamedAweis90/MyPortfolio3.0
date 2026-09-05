# 🚀 Vercel Blob Storage Setup Guide

This guide walks you through setting up **Vercel Blob Storage** for your portfolio. Vercel Blob provides lightning-fast image hosting backed by a global Edge CDN, allowing your mobile app icons, portrait screens, and widescreen desktop previews to load instantly anywhere in the world.

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Step 1: Create a Vercel Blob Store (Dashboard)](#step-1-create-a-vercel-blob-store-dashboard)
3. [Step 2: Copy the Read/Write Token](#step-2-copy-the-readwrite-token)
4. [Step 3: Configure Local Development (`.env.local`)](#step-3-configure-local-development-envlocal)
5. [Step 4: Automatic Production Linking on Vercel](#step-4-automatic-production-linking-on-vercel)
6. [Step 5: Test Drag-and-Drop & Device Upload in CMS](#step-5-test-drag-and-drop--device-upload-in-cms)
7. [Free Tier Quotas & Limits](#free-tier-quotas--limits)
8. [Automatic Local Fallback (Zero Crashes)](#automatic-local-fallback-zero-crashes)

---

## 🏗️ Architecture Overview

When you upload an image in the CMS (via Drag-and-Drop or Selecting from your device):
1. The client sends the image file via `multipart/form-data` to `/api/ugaas/upload`.
2. The server uses `@vercel/blob` (`put`) with `access: 'public'` to stream the image directly to Vercel Blob's global storage.
3. Vercel Blob returns a permanent, high-speed CDN URL:
   `https://[id].public.blob.vercel-storage.com/[folder]/[filename].png`
4. The CMS stores this lightweight URL string in MongoDB (<1KB document size).
5. Next.js (`next/image`) renders the image seamlessly with remote caching configured in `next.config.mjs`.

---

## 🛠️ Step 1: Create a Vercel Blob Store (Dashboard)

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your project repository (**`MyPortfolio3.0`** or your deployed project name).
3. In the top navigation bar of your project, click on the **Storage** tab.
4. Click the blue **Create Database** button (or **Connect Store**).
5. In the storage catalog modal, choose **Blob** (Object Storage) and click **Continue**.
6. **Configure the Store**:
   - **Store Name**: e.g., `portfolio-media` (or keep the default).
   - **Region**: Choose the region closest to you or your target audience (e.g., `iad1 - Washington D.C.` or `fra1 - Frankfurt`).
7. Click **Create Blob Store**.

---

## 🔑 Step 2: Copy the Read/Write Token

Once your Blob store is created:
1. In your Blob store details page, select the **.env.local** (or **Settings**) tab.
2. Look for the variable named:
   ```bash
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```
3. Click the **Copy** button next to the token.

---

## 💻 Step 3: Configure Local Development (`.env.local`)

1. Open `.env.local` in your code editor.
2. Find the `BLOB_READ_WRITE_TOKEN` line and paste your copied token:
   ```env
   # Vercel Blob Storage Token
   BLOB_READ_WRITE_TOKEN="vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```
3. Save `.env.local`.
4. Restart your local Next.js dev server if it is running:
   ```bash
   # Stop server with Ctrl+C, then run:
   npm run dev
   ```

---

## 🌐 Step 4: Automatic Production Linking on Vercel

When your project is hosted on Vercel:
1. If you created the Blob store **inside your Vercel project's Storage tab**, Vercel **automatically injects** `BLOB_READ_WRITE_TOKEN` into your Production, Preview, and Development environments!
2. You do **not** need to manually add `BLOB_READ_WRITE_TOKEN` to your Vercel Project Settings > Environment Variables if the store was connected through the project's Storage tab.
3. If you ever deploy to another environment or separate Vercel account:
   - Go to **Project Settings** > **Environment Variables**.
   - Add Key: `BLOB_READ_WRITE_TOKEN`
   - Add Value: `vercel_blob_rw_...`
   - Select **Production**, **Preview**, and **Development**.

---

## 🎨 Step 5: Test Drag-and-Drop & Device Upload in CMS

You can now test the upload features directly in your CMS dashboard:

1. Navigate to your CMS dashboard at [`/ugaas/projects`](http://localhost:3000/ugaas/projects).
2. Click **Add Project** (or **New Project** on the overview).
3. Switch to the **Media & Views** tab:
   - **For Mobile Projects (`Mobile App`)**:
     - **1:1 App Icon Dropzone**: Drag and drop any square icon (`.png`, `.jpg`, `.webp`) or click anywhere on the dropzone to browse your device.
     - **9:19 Portrait Screens Showcase**: Drag and drop 1 or multiple portrait mobile mockups at once. They will upload sequentially with live progress bars and instantly render in your interactive smartphone frame.
   - **For Web Projects (`Web Application`)**:
     - **16:10 Desktop Hero Banner Dropzone**: Drag and drop your main desktop view or click to select from your device. It immediately previews inside the macOS browser chrome mockup.
     - **16:10 Desktop Widescreen Gallery**: Drag and drop multiple widescreen views into the gallery.
4. Click **Save Project** — all image URLs are securely saved to MongoDB!

---

## 📊 Free Tier Quotas & Limits (Vercel Hobby Plan)

The free Hobby tier on Vercel includes:
| Feature | Free Tier Allowance | Notes |
| :--- | :--- | :--- |
| **Total Storage** | **1 GB** | Enough for ~2,000+ optimized WebP/PNG images |
| **Bandwidth** | **5 GB / month** | Global Edge CDN caching minimizes bandwidth consumption |
| **Simple Operations** | 10,000 / month | Uploads, deletes, metadata checks |
| **Advanced Operations** | 2,000 / month | Listing objects |
| **Max Upload Size** | **10 MB per file** | Enforced by `/api/ugaas/upload` route validation |

> **Pro Tip**: Use `.webp` or compressed `.png` files for portfolio assets to keep file sizes between 100KB–600KB, maximizing your storage and ensuring sub-second page loads.

---

## 🛡️ Automatic Local Fallback (Zero Crashes)

Even if you haven't set up Vercel Blob yet, or if you run offline:
- If `BLOB_READ_WRITE_TOKEN` is blank or not found in `.env.local`, the upload route `/api/ugaas/upload` **automatically falls back to storing images locally in `public/uploads/`**.
- This guarantees:
  - No 500 crashes during local testing.
  - Drag-and-drop and file picker testing work out of the box immediately.
  - As soon as you add the token, it seamlessly switches to Vercel Blob CDN without any code changes!

---

## 🔍 Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| `Invalid src prop on next/image` | Missing remote pattern for CDN host | Already resolved in `next.config.mjs` (`**.public.blob.vercel-storage.com` is configured). |
| `Upload failed: Unsupported file type` | Non-image file dropped | Only image MIME types (PNG, JPG, WebP, SVG, GIF, AVIF) are accepted. |
| `File size exceeds the 10MB limit` | File is larger than 10MB | Compress the image before uploading (e.g., using TinyPNG or Squoosh). |
| Upload returns `/uploads/...` instead of `https://...public.blob.vercel-storage.com` | `BLOB_READ_WRITE_TOKEN` not yet set in `.env.local` | Follow Steps 1–3 above to paste your token and restart `npm run dev`. |
