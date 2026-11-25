# Brainly

Brainly has a Vite/React frontend and an Express/MongoDB backend. The frontend is intended for Vercel and the backend for Render.

## Deploy the backend to Render

1. Create a Render Web Service from this GitHub repository. The included `render.yaml` can be used as a Blueprint, or configure the service manually.
2. Set the service root directory to `backend`.
3. Use `npm install && npm run build` as the build command and `npm start` as the start command. Render supplies the `PORT` value.
4. Configure these environment variables in Render:
   - `MONGO_URL`: your MongoDB connection string. Allow Render's outbound access in the MongoDB network settings.
   - `JWT_SECRET`: a long, randomly generated secret. Render can generate this when using the Blueprint.
   - `FRONTEND_URL`: the Vercel production origin, for example `https://your-app.vercel.app`. Multiple allowed origins can be comma-separated.
5. After deployment, verify `https://<your-render-service>.onrender.com/health` returns `{"status":"ok"}`.

## Deploy the frontend to Vercel

1. Import the same GitHub repository into Vercel.
2. Set the project root directory to `frontend`. Vercel should detect Vite; the build command is `npm run build` and the output directory is `dist`.
3. Add the environment variable `VITE_BACKEND_URL` with the Render service origin, for example `https://your-render-service.onrender.com` (no trailing slash).
4. Deploy the frontend. The Vercel rewrite in `frontend/vercel.json` sends `/share/<hash>` deep links to the React app.
5. Add any Vercel preview/custom origins to Render's `FRONTEND_URL` if those deployments need API access.

The Vercel and Render URLs must use HTTPS in production; the shared page automatically switches its websocket connection to WSS.

## Local environment

Copy `backend/.env.example` to `backend/.env` and set real values locally. Never commit `.env` files. For local frontend development, `VITE_BACKEND_URL` defaults to `http://localhost:3000`.