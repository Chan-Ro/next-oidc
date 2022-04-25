import type { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";
// https://github.com/vercel/next.js/pull/32139
// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextFetchEvent } from "next/server";
import { AppConfigs } from "../../config/AppConfigs";

/**
 * Middleware that checks if the user is authenticated before continuing
 * If the user is not authenticated, we redirect to the login page
 */
export default async function middleware(
  req: NextApiRequest,
  event: NextFetchEvent
) {
  // This will validate user token before rendering the page.
  const session = await getToken({
    req,
    secret: AppConfigs.NEXTAUTH_SECRET as string,
  });
  if (!session) {
    return Response.redirect("/login");
  }
}
