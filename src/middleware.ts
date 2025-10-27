import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (
      pathname.startsWith("/order-tracking") ||
      pathname.startsWith("/login")
    ) {
      return NextResponse.next();
    }

    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (role === "ADMIN") {
      const allowedPaths = ["/", "/invoices", "/customers", "/security"];

      if (pathname.startsWith("/invoices/invoice-settings")) {
        return NextResponse.redirect(new URL("/", req.url));
      }

      const canAccess = allowedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );
      if (!canAccess) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico|icons).*)"],
  // matcher: ["/((?!api/auth|_next|static|favicon.ico|icons).*)"],
};
