# Akramul Islam — Cyber Security Portfolio

Premium Next.js portfolio and protected content dashboard for Akramul Islam, Cyber Security Expert & Digital Security Consultant, and Founder of DigitX.

## Requirements

- Node.js 20 LTS or newer
- A MongoDB Atlas database containing the existing portfolio records
- npm

## Local installation

```bash
npm ci
cp .env.example .env.local
```

Set these values in `.env.local`:

```text
MONGODB_URI=mongodb+srv://<database-user>:<url-encoded-password>@<atlas-host>/<database>?retryWrites=true&w=majority
ADMIN_SESSION_SECRET=<unique-random-secret-at-least-32-characters>
UPSTASH_REDIS_REST_URL=https://<your-upstash-endpoint>
UPSTASH_REDIS_REST_TOKEN=<upstash-rest-token>
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Start the application:

```bash
npm run dev
```

Quality checks:

```bash
npm run lint
npm run build
```

Do not commit `.env.local`, `MONGODB_URI`, `ADMIN_SESSION_SECRET`, or either Upstash credential.

## Admin security

- Sign in at `/admin` with the existing Admin record.
- Sessions are HMAC-signed and stored in an `HttpOnly` cookie. The cookie is `Secure` in production and uses `SameSite=Lax`.
- Dashboard pages, admin details, and every content create/update/delete endpoint require a valid signed session.
- Write requests must also have a same-origin `Origin` header; cross-origin writes receive `403`.
- Passwords are never returned by the API. New passwords are stored with scrypt and must have at least 12 characters.
- Login attempts are distributed-rate-limited by both IP address and normalized email address (five attempts per 15 minutes). The IP and email identifiers are SHA-256 hashed before they are sent to Redis.
- Sign-in fails closed with `503` if the required Upstash Redis settings are missing or unreachable, so a serverless instance can never silently fall back to a per-instance counter.

If an old record uses a legacy plaintext password, it is verified only server-side with a timing-safe comparison. Sign in and change it from **Admin Information** after deployment to store a scrypt hash. This explicit action is the only password migration path; authentication itself never mutates the record. Malformed values claiming to be scrypt hashes are rejected rather than treated as plaintext.

## Vercel deployment

1. Import this repository/project into Vercel. Do not deploy until the environment variables below are set.
2. In **Project Settings → Environment Variables**, configure:

   ```text
   MONGODB_URI=<production-atlas-uri>
   ADMIN_SESSION_SECRET=<unique-random-secret-at-least-32-characters>
   UPSTASH_REDIS_REST_URL=https://<your-upstash-endpoint>
   UPSTASH_REDIS_REST_TOKEN=<upstash-rest-token>
   NEXT_PUBLIC_SITE_URL=https://akramul-security-portfolio.vercel.app
   ```

3. Create an Upstash Redis database and add its REST URL and token exactly as shown in its dashboard. These two server-only settings are required for protected sign-in.
4. In MongoDB Atlas, permit the Vercel deployment to access the cluster using the narrowest practical network rule. Use a least-privilege database user.
5. Create a Preview deployment first. Confirm the homepage, `/robots.txt`, `/sitemap.xml`, `/admin`, protected write behavior, and the `429` response after repeated failed sign-ins.
6. Deploy to Production only after approval.

The application does not seed, reset, delete, or overwrite MongoDB records during build or deployment.

For additional production configuration notes, see `DEPLOYMENT-FIX.md`.
