import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

// Rate limiting simple en memoria (para producción usar Redis)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuración de rate limiting por ruta
const RATE_LIMITS = {
  "/api/comments": { requests: 5, windowMs: 60000 }, // 5 requests per minute
  "/api/newsletter": { requests: 3, windowMs: 60000 }, // 3 requests per minute
  "/api/search": { requests: 20, windowMs: 60000 }, // 20 requests per minute
  default: { requests: 100, windowMs: 60000 }, // 100 requests per minute
};

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  return "unknown";
}

function isRateLimited(ip: string, path: string): boolean {
  const now = Date.now();
  const key = `${ip}:${path}`;

  // Encontrar configuración de rate limit para esta ruta
  const config = Object.entries(RATE_LIMITS).find(([route]) =>
    path.startsWith(route)
  )?.[1] || RATE_LIMITS.default;

  const current = rateLimitMap.get(key);

  if (!current || now > current.resetTime) {
    // Primera request o ventana expirada
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return false;
  }

  if (current.count >= config.requests) {
    return true;
  }

  current.count++;
  return false;
}

// Limpiar entradas expiradas cada 5 minutos
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);

  // Rate limiting para rutas API
  if (pathname.startsWith("/api/")) {
    if (isRateLimited(clientIP, pathname)) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          message: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "60",
          },
        }
      );
    }
  }

  // Protección CSRF básica para métodos POST/PUT/DELETE
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    const referer = request.headers.get("referer");

    // Verificar origen para requests de API
    if (pathname.startsWith("/api/")) {
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_SITE_URL,
        `https://${host}`,
        `http://${host}`, // Solo para desarrollo
      ].filter(Boolean);

      // En desarrollo, permitir localhost
      if (process.env.NODE_ENV === "development") {
        allowedOrigins.push("http://localhost:3000", "http://127.0.0.1:3000");
      }

      if (origin && !allowedOrigins.some(allowed => allowed && origin.startsWith(allowed))) {
        return new NextResponse(
          JSON.stringify({
            error: "Forbidden",
            message: "Invalid origin",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    }
  }

  // Headers adicionales de seguridad
  const response = NextResponse.next();

  // Agregar headers de seguridad específicos
  response.headers.set("X-Request-ID", crypto.randomUUID());

  // Para rutas API, agregar headers específicos
  if (pathname.startsWith("/api/")) {
    response.headers.set("X-API-Version", "1.0");
    response.headers.set("Access-Control-Allow-Credentials", "false");

    // CORS headers para API
    if (request.method === "OPTIONS") {
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
      response.headers.set("Access-Control-Max-Age", "86400");
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files)
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};