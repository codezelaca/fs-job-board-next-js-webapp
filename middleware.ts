import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Exclude api, _next/static, _next/image, favicon.ico
  if (
    nextUrl.pathname.startsWith("/api") ||
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname === "/favicon.ico"
  ) {
    return;
  }

  // Define route categories
  const isAuthRoute = nextUrl.pathname.startsWith("/login") || 
                      nextUrl.pathname.startsWith("/signup") || 
                      nextUrl.pathname.startsWith("/forgot-password") || 
                      nextUrl.pathname.startsWith("/reset-password");
                      
  const isDashboardRoute = nextUrl.pathname.includes("-dashboard") || nextUrl.pathname.startsWith("/admin");
  const isOnboardingRoute = nextUrl.pathname.startsWith("/onboarding");

  // Handle unauthenticated users
  if (!isLoggedIn) {
    if (isDashboardRoute || isOnboardingRoute) {
      return Response.redirect(new URL("/login", nextUrl));
    }
    return;
  }

  // Handle authenticated users
  const role = req.auth?.user?.role as string;
  const onboardingCompleted = req.auth?.user?.onboardingCompleted as boolean;

  // Redirect away from auth pages
  if (isAuthRoute) {
    if (role === "RECRUITER") return Response.redirect(new URL("/recruiter-dashboard", nextUrl));
    if (role === "JOB_SEEKER") return Response.redirect(new URL("/candidate-dashboard", nextUrl));
    if (role === "ADMIN") return Response.redirect(new URL("/admin-dashboard", nextUrl));
    return Response.redirect(new URL("/", nextUrl));
  }

  // Onboarding logic
  if (!onboardingCompleted) {
    if (role === "RECRUITER" && !nextUrl.pathname.startsWith("/onboarding/recruiter")) {
      return Response.redirect(new URL("/onboarding/recruiter", nextUrl));
    }
    if (role === "JOB_SEEKER" && !nextUrl.pathname.startsWith("/onboarding/candidate")) {
      return Response.redirect(new URL("/onboarding/candidate", nextUrl));
    }
    // Don't enforce onboarding for admins
  } else {
    // If onboarding is completed, prevent accessing onboarding pages
    if (isOnboardingRoute) {
      if (role === "RECRUITER") return Response.redirect(new URL("/recruiter-dashboard", nextUrl));
      if (role === "JOB_SEEKER") return Response.redirect(new URL("/candidate-dashboard", nextUrl));
    }
  }

  // Role-Based Access Control (RBAC)
  if (nextUrl.pathname.startsWith("/recruiter-dashboard") && role !== "RECRUITER" && role !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }
  if (nextUrl.pathname.startsWith("/candidate-dashboard") && role !== "JOB_SEEKER" && role !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }
  if (nextUrl.pathname.startsWith("/admin") && role !== "ADMIN") {
    return Response.redirect(new URL("/", nextUrl));
  }
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
