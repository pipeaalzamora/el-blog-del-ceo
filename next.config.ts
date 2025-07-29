import type { NextConfig } from "next";

// Suprimir warnings de deprecación específicos
if (typeof process !== "undefined") {
  const originalEmitWarning = process.emitWarning;
  process.emitWarning = function (warning, type, code, ...args) {
    // Suprimir el warning específico de url.parse()
    if (code === "DEP0169") {
      return;
    }
    return originalEmitWarning.call(this, warning, type, code, ...args);
  };
}

const nextConfig: NextConfig = {
  // Configuración optimizada de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-west-2.amazonaws.com",
        pathname: "/secure.notion-static.com/**",
      },
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
    ],
    // Formatos modernos primero para mejor compresión
    formats: ["image/avif", "image/webp"],
    // Tamaños optimizados para diferentes dispositivos
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Configuración de calidad y optimización
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuración adicional
  poweredByHeader: false, // Remover header "powered by Next.js"

  // Headers de seguridad mejorados
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    // CSP más permisivo en desarrollo, estricto en producción
    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://www.notion.so https://images.unsplash.com https://s3.us-west-2.amazonaws.com https://prod-files-secure.s3.us-west-2.amazonaws.com https://www.google-analytics.com",
      "media-src 'self'",
      "connect-src 'self' https://api.resend.com https://www.google-analytics.com https://analytics.google.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      isDev ? "upgrade-insecure-requests" : "upgrade-insecure-requests",
    ].filter(Boolean);

    return [
      {
        source: "/(.*)",
        headers: [
          // Seguridad básica
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },

          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: cspDirectives.join("; "),
          },

          // Permissions Policy (antes Feature Policy)
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },

          // HSTS (solo en producción)
          ...(isDev
            ? []
            : [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=31536000; includeSubDomains; preload",
                },
              ]),

          // Cache control para recursos estáticos
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      // Headers específicos para API routes
      {
        source: "/api/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Cache-Control",
            value: "no-store, no-cache, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
