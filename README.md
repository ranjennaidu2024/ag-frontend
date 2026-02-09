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

### Environment Variables

The frontend uses environment variables to configure the backend API URL. This allows different URLs for local development and production.

**Local Development:**
- By default, the frontend connects to `http://localhost:8080/api` (your local backend)
- No configuration needed if running backend locally on port 8080

**Production (GCP):**
- Set `NEXT_PUBLIC_API_BASE_URL` environment variable to your deployed backend URL
- Example: `NEXT_PUBLIC_API_BASE_URL=https://antigravity-backend-xxxxx-uc.a.run.app/api`

**Creating `.env.local` for Local Development (Optional):**

If you want to override the default localhost URL, create a `.env.local` file in the frontend root:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

**Note:** 
- Environment variables prefixed with `NEXT_PUBLIC_` are exposed to the browser
- Never commit `.env.local` to version control (it's already in `.gitignore`)
- For production, set environment variables in Cloud Run (see deployment steps below)

### Cloud Build Configuration File

This project includes a `cloudbuild.yaml` file that can be used for Cloud Build deployments. The file is configured to:
- Build the Docker image using the project ID and commit SHA as tags
- Push the image to Google Container Registry (GCR)
- Use Cloud Logging only (no custom logs bucket required)

You can use this file directly in Cloud Build triggers, or use the inline YAML configuration as described in the deployment steps below.

## Deploying to Google Cloud Platform (GCP)

This guide will walk you through deploying the frontend application to Google Cloud Platform using **Cloud Run** via the GCP Console UI only (no CLI required).

**Quick Reference - Backend API Configuration:**
- After deploying both frontend and backend, you need to configure the backend URL
- Set environment variable `NEXT_PUBLIC_API_BASE_URL` in Cloud Run to: `https://your-backend-url/api`
- See **Step 6** (during deployment) or **Step 7** (after deployment) for detailed instructions

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

**Important:** This step uses an **Inline YAML configuration** instead of the "Dockerfile" option to avoid UI bugs and properly handle logging requirements, especially when using custom service accounts.

1. In GCP Console, click **☰** menu > **"Cloud Build"** > **"Triggers"**
2. Click **"CREATE TRIGGER"**
3. Configure the trigger:
   - **Name**: `antigravity-frontend-build`
   - **Event**: Select **"Push to a branch"**
   - **Source**: 
     - If using Source Repositories: Select your repository
     - If using GitHub: Connect your GitHub account and select the repository
   - **Branch**: `^main$` (or your main branch name, e.g., `^master$`)
   
4. **Configuration Settings (Critical):**
   - **Configuration**: Select **"Cloud Build configuration file (yaml or json)"** (NOT "Dockerfile")
   - **Location**: Select **"Inline"** (this allows you to paste the YAML directly)
   - **Cloud Build configuration file contents**: Paste the following YAML:
   
   ```yaml
steps:
  - name: gcr.io/cloud-builders/docker
    args:
      - build
      - '-t'
      - gcr.io/$PROJECT_ID/frontend:latest
      - '-t'
      - gcr.io/$PROJECT_ID/frontend:$COMMIT_SHA
      - .
  - name: gcr.io/cloud-builders/docker
    args:
      - push
      - gcr.io/$PROJECT_ID/frontend
options:
  logging: CLOUD_LOGGING_ONLY
   ```

5. **Service Account Configuration (if using custom service account):**
   - Scroll down to **"Advanced"** section
   - If you're using a custom service account, you'll need to grant it proper permissions (see Step 4a below)
   - If using default service account, you can skip to Step 6

6. Click **"CREATE"**

#### Step 4a: Configure Service Account Permissions (Required if using custom service account)

If you're using a custom service account for Cloud Build, you need to grant it the following IAM roles to avoid "Denied" or "Repo Not Found" errors:

1. Go to **"IAM & Admin"** > **"IAM"** in GCP Console
2. Find your service account (or the Cloud Build service account)
3. Click the **✏️ (edit/pencil icon)** next to the service account
4. Click **"ADD ANOTHER ROLE"** and add these three roles:
   - **Logs Writer** (`roles/logging.logWriter`) - To send logs to Cloud Logging
   - **Artifact Registry Writer** (`roles/artifactregistry.writer`) - To upload the image
   - **Artifact Registry Create-on-push Writer** (`roles/artifactregistry.createOnPushWriter`) - To allow automatic creation of the "frontend" repository during first push
5. Click **"SAVE"**

**Note:** If you're using the default compute service account, these permissions are usually already configured. The custom service account approach gives you more control but requires manual permission setup.

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
   - **Container image URL**: Click **"SELECT"** and choose the image you just built (it should be named something like `gcr.io/YOUR-PROJECT-ID/frontend:COMMIT_SHA` or you can select the latest tag)
     - **Note:** The image name format is `gcr.io/YOUR-PROJECT-ID/frontend:COMMIT_SHA` based on the Cloud Build configuration
     - You can select any commit SHA tag, or use the latest build
   - **Container port**: `3000`
   - **CPU allocation**: Select **"CPU is only allocated during request processing"** (to save costs)
   - **Memory**: `512 MiB` (minimum, increase if needed)
   - **Minimum number of instances**: `0` (to allow scaling to zero)
   - **Maximum number of instances**: `10` (adjust as needed)
   - **Concurrency**: `80` (default)
   - **Request timeout**: `300` seconds

   **Container Settings:**
   - Click **"Container"** tab
   - **Environment variables**: Add the following environment variables:
     - `NODE_ENV` = `production`
     - `NEXT_PUBLIC_API_BASE_URL` = `https://your-backend-service-url/api`
       - **Important:** Replace `your-backend-service-url` with your actual backend Cloud Run service URL
       - Example: If your backend URL is `https://antigravity-backend-xxxxx-uc.a.run.app`, then set:
         - `NEXT_PUBLIC_API_BASE_URL` = `https://antigravity-backend-xxxxx-uc.a.run.app/api`
       - **How to find your backend URL:** Go to **"Cloud Run"** > Select your backend service > Copy the URL from the top of the page
       - **Note:** Make sure to include `/api` at the end of the URL (the frontend appends endpoint paths like `/projects` to this base URL)
   - **Port**: `3000`

   **Security:**
   - **Authentication**: Select **"Allow unauthenticated invocations"** (to make it publicly accessible)

4. Click **"CREATE"** or **"DEPLOY"**
5. Wait for the deployment to complete (this may take a few minutes)

#### Step 7: Configure Backend API URL

**Important:** Before accessing your application, you need to configure the backend API URL so the frontend can communicate with your deployed backend service.

**If you haven't set the environment variable during deployment (Step 6), you can add it now:**

1. Go to **"Cloud Run"** > Select your frontend service (`antigravity-frontend`)
2. Click **"EDIT & DEPLOY NEW REVISION"**
3. Scroll down to **"Container"** section
4. Under **"Environment variables"**, click **"ADD VARIABLE"**
5. Add:
   - **Name**: `NEXT_PUBLIC_API_BASE_URL`
   - **Value**: `https://your-backend-service-url/api`
     - Replace `your-backend-service-url` with your backend Cloud Run URL
     - Example: `https://antigravity-backend-xxxxx-uc.a.run.app/api`
6. Click **"DEPLOY"** to apply the changes

**How to find your backend URL:**
1. Go to **"Cloud Run"** in GCP Console
2. Find and click on your backend service (e.g., `antigravity-backend`)
3. Copy the URL shown at the top (e.g., `https://antigravity-backend-xxxxx-uc.a.run.app`)
4. Append `/api` to this URL for the environment variable value

**Verifying the Configuration:**
- After deployment, check the Cloud Run logs to ensure the environment variable is set
- Test the frontend application - it should now be able to fetch data from the backend
- Open browser developer tools (F12) → Network tab → Check API calls are going to the correct backend URL

#### Step 8: Access Your Deployed Application

1. Once deployment is complete, you'll see your service in the Cloud Run dashboard
2. Click on your service name (`antigravity-frontend`)
3. You'll see a **URL** at the top of the page (e.g., `https://antigravity-frontend-xxxxx-uc.a.run.app`)
4. Click on this URL or copy it to access your deployed application
5. Your application should now be able to communicate with your backend API!

**Testing the Connection:**
- Open your frontend URL in a browser
- Open browser developer tools (F12) → **Console** tab
- Check for any API errors
- Go to **Network** tab → Look for requests to `/api/projects` - they should be going to your backend URL
- If you see CORS errors, ensure your backend CORS configuration allows requests from your frontend domain

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
6. **Important:** Verify that `NEXT_PUBLIC_API_BASE_URL` environment variable is still set correctly
7. Click **"DEPLOY"**

#### Updating Backend API URL
If your backend URL changes or you need to point to a different backend:

1. Go to **"Cloud Run"** > Select your frontend service
2. Click **"EDIT & DEPLOY NEW REVISION"**
3. Scroll to **"Container"** section → **"Environment variables"**
4. Find `NEXT_PUBLIC_API_BASE_URL` and update its value
5. Click **"DEPLOY"** to apply changes
6. The new backend URL will be used immediately after deployment

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

#### Frontend Cannot Connect to Backend API
- **Verify environment variable is set:**
  1. Go to **"Cloud Run"** > Your frontend service > **"EDIT & DEPLOY NEW REVISION"**
  2. Check **"Environment variables"** section
  3. Ensure `NEXT_PUBLIC_API_BASE_URL` is set and points to your backend URL (with `/api` suffix)
  4. Example: `https://antigravity-backend-xxxxx-uc.a.run.app/api`

- **Check backend URL is correct:**
  - Go to **"Cloud Run"** > Your backend service
  - Copy the exact URL shown at the top
  - Ensure the environment variable uses this URL + `/api`

- **Test backend is accessible:**
  - Open your backend URL in browser: `https://your-backend-url/actuator/health`
  - Should return: `{"status":"UP"}`
  - Test API endpoint: `https://your-backend-url/api/projects`
  - Should return JSON data or an empty array

- **Check CORS configuration:**
  - If you see CORS errors in browser console, ensure backend allows requests from your frontend domain
  - Backend should allow: `https://your-frontend-url` (without trailing slash)
  - Check backend `WebConfig.java` CORS settings

- **Check browser console:**
  - Open browser developer tools (F12) → **Console** tab
  - Look for API errors or CORS errors
  - Go to **Network** tab → Check if API requests are being made and what the response is

- **Verify both services are deployed:**
  - Ensure backend service is running (green status in Cloud Run)
  - Ensure frontend service is running (green status in Cloud Run)
  - Both should be in the same GCP project (or backend should allow cross-project access)

#### Container Image Not Found
- Ensure Cloud Build completed successfully
- Check **"Container Registry"** > **"Images"** to verify image exists
- Verify you're selecting the correct image in Cloud Run deployment

#### Cloud Build Trigger Error: "Failed to trigger build: if 'build.service_account' is specified..."

This error occurs when a service account is specified but logging configuration is missing. The recommended solution is to use the **Inline YAML configuration** approach described in Step 4.

**Solution 1: Use Inline YAML Configuration (Recommended - Works Every Time)**
1. Go to **"Cloud Build"** > **"Triggers"**
2. Click on your trigger name (`antigravity-frontend-build`)
3. Click **"EDIT"** button
4. Change **"Configuration"** from **"Dockerfile"** to **"Cloud Build configuration file (yaml or json)"**
5. Set **"Location"** to **"Inline"**
6. Paste the YAML configuration from Step 4 (with `logging: CLOUD_LOGGING_ONLY` in options)
7. Click **"SAVE"**

**Solution 2: Fix Service Account Permissions**
If you're still getting "Denied" or "Repo Not Found" errors:
1. Follow **Step 4a** above to grant proper IAM roles to your service account
2. Ensure these roles are added:
   - `roles/logging.logWriter`
   - `roles/artifactregistry.writer`
   - `roles/artifactregistry.createOnPushWriter`

**Solution 3: Use Default Service Account**
1. Go to **"Cloud Build"** > **"Triggers"**
2. Click on your trigger name
3. Click **"EDIT"**
4. In **"Advanced"** section, find **"Service account"**
5. Change it to **"Default compute service account"** (or leave it empty)
6. Click **"SAVE"**

**Why Inline YAML Works Better:**
- The "Dockerfile" configuration option sometimes hides logging settings in the UI
- Inline YAML gives you full control over all build options
- The `logging: CLOUD_LOGGING_ONLY` option in YAML explicitly satisfies the logging requirement

### Additional Resources

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Build Documentation](https://cloud.google.com/build/docs)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [GCP Free Tier](https://cloud.google.com/free)

---

## Development Notes

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
