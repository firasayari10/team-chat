import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request) => {
  // If user is not authenticated and trying to access a protected page, redirect to auth
  if (!isPublicPage(request) && !(await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }
  
  // If user is authenticated and trying to access auth page, redirect to home
  if (isPublicPage(request) && (await isAuthenticatedNextjs())) {
    return nextjsMiddlewareRedirect(request, "/");
  }
});

export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};