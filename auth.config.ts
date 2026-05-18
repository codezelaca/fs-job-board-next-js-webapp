import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    newUser: "/signup",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.includes("-dashboard") || nextUrl.pathname.startsWith("/admin");
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        const role = auth.user.role as string;
        
        // Prevent logged-in users from accessing login/signup pages
        if (nextUrl.pathname.startsWith("/login") || nextUrl.pathname.startsWith("/signup")) {
          if (role === "RECRUITER") return Response.redirect(new URL("/recruiter-dashboard", nextUrl));
          if (role === "JOB_SEEKER") return Response.redirect(new URL("/candidate-dashboard", nextUrl));
          if (role === "ADMIN") return Response.redirect(new URL("/admin-dashboard", nextUrl));
          return Response.redirect(new URL("/", nextUrl));
        }
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.onboardingCompleted = user.onboardingCompleted;
      }
      if (trigger === "update" && session) {
        token.onboardingCompleted = session.onboardingCompleted;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
