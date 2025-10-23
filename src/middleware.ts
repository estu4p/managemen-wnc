import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    // Halaman publik
    if (
      pathname.startsWith("/order-tracking") ||
      pathname.startsWith("/login")
    ) {
      return NextResponse.next();
    }

    // Belum login
    if (!role) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ADMIN
    if (role === "ADMIN") {
      const allowedPaths = ["/", "/invoices", "/customers"];
      const canAccess = allowedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`)
      );
      if (!canAccess) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // SUPERADMIN bebas
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next|static|favicon.ico).*)"],
};
