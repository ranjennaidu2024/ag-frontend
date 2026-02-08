# Antigravity Frontend - Next.js Application

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Local Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

### Build for Production

```bash
npm run build
npm start
```

## Deploying to Google Cloud Platform (GCP)

This guide will walk you through deploying the frontend application to Google Cloud Platform using **Cloud Run** via the GCP Console UI only (no CLI required).

### Prerequisites

1. A Google Cloud Platform account ([Sign up here](https://cloud.google.com/) if you don't have one)
2. A GCP project created (or you'll create one during deployment)
3. A credit card (GCP offers free credits for new users)

### Step-by-Step Deployment Guide

#### Step 1: Create a GCP Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page (next to "Google Cloud")
3. Click **"NEW PROJECT"**
4. Enter a project name (e.g., `antigravity-frontend`)
5. Click **"CREATE"**
6. Wait for the project to be created, then select it from the project dropdown

#### Step 2: Enable Required APIs

1. In the GCP Console, click the **☰ (hamburger menu)** in the top left
2. Navigate to **"APIs & Services"** > **"Library"**
3. Search for **"Cloud Run API"** and click on it
4. Click **"ENABLE"** button
5. Search for **"Cloud Build API"** and click on it
6. Click **"ENABLE"** button
7. Search for **"Container Registry API"** and click on it
8. Click **"ENABLE"** button

#### Step 3: Prepare Your Code for Upload

You have two options:

**Option A: Upload via Cloud Source Repositories (Recommended)**
1. In GCP Console, click **☰** menu > **"Source Repositories"**
2. Click **"CREATE REPOSITORY"**
3. Select **"Create new repository"**
4. Name it `antigravity-frontend` and click **"CREATE"**
5. Follow the instructions to push your code (you can use the provided git commands, or upload manually via the web interface)

**Option B: Upload via Cloud Build (Direct Upload)**
1. Zip your entire `frontend` folder (make sure to include `Dockerfile`, `package.json`, and all source files)
2. Keep this zip file ready for upload in the next steps

#### Step 4: Create a Cloud Build Trigger

1. In GCP Console, click **☰** menu > **"Cloud Build"** > **"Triggers"**
2. Click **"CREATE TRIGGER"**
3. Configure the trigger:
   - **Name**: `antigravity-frontend-build`
   - **Event**: Select **"Push to a branch"**
   - **Source**: 
     - If using Source Repositories: Select your repository
     - If uploading manually: Select **"Cloud Source Repositories"** and create a new repo
   - **Branch**: `^main$` (or your main branch name)
   - **Configuration**: Select **"Dockerfile"**
   - **Location**: Select **"Cloud Source Repositories"** or **"Cloud Storage"** if uploading zip
   - **Dockerfile location**: `Dockerfile`
   - **Dockerfile directory**: `/` (root of your project)
4. Click **"CREATE"**

#### Step 5: Build Your Container Image

**If using Source Repositories:**
1. Push your code to the repository (or use the web interface to upload files)
2. Go to **"Cloud Build"** > **"History"**
3. Your build should start automatically
4. Wait for the build to complete (you'll see a green checkmark when done)

**If uploading manually:**
1. Go to **"Cloud Build"** > **"History"**
2. Click **"RUN TRIGGER"** or **"RUN"** button
3. Select your trigger
4. Click **"RUN"**
5. Wait for the build to complete

#### Step 6: Deploy to Cloud Run

1. In GCP Console, click **☰** menu > **"Cloud Run"**
2. Click **"CREATE SERVICE"**
3. Configure your service:

   **Service Settings:**
   - **Service name**: `antigravity-frontend`
   - **Region**: Choose a region close to your users (e.g., `us-central1`, `us-east1`, `europe-west1`)
   - **Deploy one revision from an existing container image**: Click **"SELECT"**
   - **Container image URL**: Click **"SELECT"** and choose the image you just built (it should be named something like `gcr.io/YOUR-PROJECT-ID/antigravity-frontend`)
   - **Container port**: `3000`
   - **CPU allocation**: Select **"CPU is only allocated during request processing"** (to save costs)
   - **Memory**: `512 MiB` (minimum, increase if needed)
   - **Minimum number of instances**: `0` (to allow scaling to zero)
   - **Maximum number of instances**: `10` (adjust as needed)
   - **Concurrency**: `80` (default)
   - **Request timeout**: `300` seconds

   **Container Settings:**
   - Click **"Container"** tab
   - **Environment variables**: Add any required environment variables here (e.g., `NODE_ENV=production`)
   - **Port**: `3000`

   **Security:**
   - **Authentication**: Select **"Allow unauthenticated invocations"** (to make it publicly accessible)

4. Click **"CREATE"** or **"DEPLOY"**
5. Wait for the deployment to complete (this may take a few minutes)

#### Step 7: Access Your Deployed Application

1. Once deployment is complete, you'll see your service in the Cloud Run dashboard
2. Click on your service name (`antigravity-frontend`)
3. You'll see a **URL** at the top of the page (e.g., `https://antigravity-frontend-xxxxx-uc.a.run.app`)
4. Click on this URL or copy it to access your deployed application
5. Your application is now publicly accessible!

### Alternative: Deploy Using Cloud Build with Manual Upload

If you prefer to upload files directly without using git:

1. **Create a Cloud Storage Bucket:**
   - Go to **"Cloud Storage"** > **"Buckets"**
   - Click **"CREATE BUCKET"**
   - Name it (e.g., `antigravity-frontend-source`)
   - Choose a location and click **"CREATE"**

2. **Upload Your Code:**
   - Click on your bucket
   - Click **"UPLOAD FILES"**
   - Upload your zipped frontend folder
   - Extract it or upload individual files

3. **Create a Cloud Build Configuration:**
   - Go to **"Cloud Build"** > **"Triggers"**
   - Click **"CREATE TRIGGER"**
   - Select **"Manual"** as the event source
   - Configure to build from your uploaded files
   - Set Dockerfile path and build the image

4. **Deploy to Cloud Run** (follow Step 6 above)

### Managing Your Deployment

#### Viewing Logs
1. Go to **"Cloud Run"** > Select your service
2. Click on **"LOGS"** tab to view application logs
3. You can filter and search logs here

#### Updating Your Application
1. Make changes to your code
2. Push to your repository (or upload new files)
3. Cloud Build will automatically trigger (if configured) or manually run the build
4. Once the new image is built, go to **"Cloud Run"** > Your service > **"EDIT & DEPLOY NEW REVISION"**
5. Select the new container image
6. Click **"DEPLOY"**

#### Setting Custom Domain (Optional)
1. Go to **"Cloud Run"** > Your service > **"MANAGE CUSTOM DOMAINS"**
2. Click **"ADD MAPPING"**
3. Follow the instructions to verify domain ownership
4. Configure DNS settings as instructed

### Cost Considerations

- **Cloud Run** charges based on:
  - CPU and memory usage during request processing
  - Number of requests
  - Network egress
- With the configuration above (scaling to zero), you'll only pay when your app receives traffic
- GCP offers a **Free Tier** with generous limits for Cloud Run
- Estimated cost for low-traffic sites: **$0-5/month** (often free within free tier limits)

### Troubleshooting

#### Build Fails
- Check **"Cloud Build"** > **"History"** for error details
- Ensure `Dockerfile` is in the root of your project
- Verify `package.json` has all required dependencies

#### Application Not Accessible
- Check that **"Allow unauthenticated invocations"** is enabled
- Verify the service is deployed and running (green status)
- Check the **"LOGS"** tab for runtime errors

#### Application Crashes
- Check **"Cloud Run"** > **"LOGS"** for error messages
- Verify environment variables are set correctly
- Ensure port 3000 is exposed in Dockerfile
- Check memory allocation (increase if needed)

#### Container Image Not Found
- Ensure Cloud Build completed successfully
- Check **"Container Registry"** > **"Images"** to verify image exists
- Verify you're selecting the correct image in Cloud Run deployment

### Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [GCP Free Tier](https://cloud.google.com/free)

---

## Development Notes

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
