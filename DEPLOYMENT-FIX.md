# Production configuration

This project was prepared locally only. No deployment or database update was performed.

## Required Vercel environment variables

Set these in **Vercel → Project Settings → Environment Variables** for Production (and Preview/Development only where needed):

```text
MONGODB_URI=mongodb+srv://<database-user>:<url-encoded-password>@<atlas-host>/<database>?retryWrites=true&w=majority
ADMIN_SESSION_SECRET=<unique-random-secret-at-least-32-characters>
UPSTASH_REDIS_REST_URL=https://<your-upstash-endpoint>
UPSTASH_REDIS_REST_TOKEN=<upstash-rest-token>
NEXT_PUBLIC_SITE_URL=https://akramul-security-portfolio.vercel.app
```

- Copy the Atlas URI from the active cluster; do not guess the hostname.
- URL-encode special characters in the database password.
- Do not prefix `MONGODB_URI` or `ADMIN_SESSION_SECRET` with `NEXT_PUBLIC_`.
- Create an Upstash Redis database and copy its REST URL and token to the two `UPSTASH_` settings. They must stay server-only; sign-in fails closed if either setting is unavailable.
- Add an Atlas network rule that permits the deployment to connect, using the narrowest feasible access rule.

## Pre-deployment checks

1. Run `npm ci`.
2. Run `npm run lint`.
3. Run `npm run build`.
4. Confirm `/admin` can sign in using the existing Admin record.
5. Confirm an unauthenticated content write returns `401` and a cross-origin request returns `403`.
6. Confirm repeated failed sign-ins return `429` after the configured distributed limit (five attempts in 15 minutes).
7. After the first successful sign-in, set a new password of at least 12 characters in the Admin Information screen so it is stored with scrypt.

The application does not seed, reset, or migrate portfolio records during deployment. Existing MongoDB records remain untouched unless a signed-in administrator explicitly changes them through the protected dashboard.
