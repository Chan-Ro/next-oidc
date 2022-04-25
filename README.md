This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
Install node version [16](https://nodejs.org/en/)

Go to app folder `cd ./app` then

To install libraries and get prepared:

```bash
npm ci OR npm install
```

First, run the development server:

```bash
npm run start
# or
yarn start
```

## Prepare OIDC
http://localhost:8888 will trigger OIDC (Should be redirecting to login page if configured correctly)
To change configuration, add values for following variables in env file:
```bash
ONELOGIN_CLIENT_ID
ONELOGIN_CLIENT_SECRET
ONELOGIN_ISSUER
```
Once values are set, restart the server.