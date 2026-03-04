import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  runtime: "nodejs",   // ← force Node.js, not Edge
};

const isProtectedRoute = createRouteMatcher(["/"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth.protect();
});