/**
 * Utilidades de sanitización sin dependencias externas
 * Para uso en servidor y cliente
 */

/**
 * Sanitiza texto plano removiendo HTML y caracteres peligrosos
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Remover HTML completamente usando regex simple
  const cleaned = input
    .replace(/<[^>]*>/g, "") // Remover tags HTML
    .replace(/&[^;]+;/g, "") // Remover entidades HTML
    .replace(/[<>\"'&]/g, ""); // Remover caracteres peligrosos

  // Normalizar espacios en blanco
  return cleaned
    .replace(/\s+/g, " ") // Múltiples espacios a uno solo
    .replace(/[\r\n\t]/g, " ") // Saltos de línea y tabs a espacios
    .trim();
}

/**
 * Sanitiza HTML permitiendo tags seguros básicos
 */
export function sanitizeHTML(input: string): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  // Lista de tags permitidos
  const allowedTags = ["p", "br", "strong", "em", "u", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li"];

  // Remover scripts y otros elementos peligrosos
  let cleaned = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>/gi, "")
    .replace(/<object\b[^>]*>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/vbscript:/gi, "");

  // Solo permitir tags seguros
  cleaned = cleaned.replace(/<(\/?)([\w]+)([^>]*)>/gi, (match, slash, tag, attrs) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      // Limpiar atributos peligrosos
      const cleanAttrs = attrs.replace(/on\w+\s*=\s*["'][^"']*["']/gi, "");
      return `<${slash}${tag}${cleanAttrs}>`;
    }
    return "";
  });

  return cleaned;
}

/**
 * Sanitiza email removiendo caracteres peligrosos
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return "";
  }

  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, ""); // Solo permitir caracteres válidos para email
}

/**
 * Sanitiza nickname removiendo caracteres especiales
 */
export function sanitizeNickname(nickname: string): string {
  if (!nickname || typeof nickname !== "string") {
    return "Anónimo";
  }

  const cleaned = nickname
    .trim()
    .replace(/[<>\"'&]/g, "") // Remover caracteres HTML peligrosos
    .replace(/\s+/g, " ") // Normalizar espacios
    .substring(0, 30); // Limitar longitud

  return cleaned || "Anónimo";
}

/**
 * Detecta contenido potencialmente malicioso
 */
export function detectMaliciousContent(input: string): boolean {
  if (!input || typeof input !== "string") {
    return false;
  }

  const maliciousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Scripts
    /javascript:/gi, // JavaScript URLs
    /on\w+\s*=/gi, // Event handlers
    /data:text\/html/gi, // Data URLs HTML
    /vbscript:/gi, // VBScript
    /<iframe\b/gi, // iframes
    /<object\b/gi, // Objects
    /<embed\b/gi, // Embeds
    /<form\b/gi, // Forms
    /expression\s*\(/gi, // CSS expressions
    /url\s*\(\s*javascript:/gi, // CSS JavaScript URLs
  ];

  return maliciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Valida y sanitiza URL
 */
export function sanitizeURL(url: string): string | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url);

    // Solo permitir HTTP y HTTPS
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Función de sanitización general que combina todas las validaciones
 */
export function sanitizeInput(input: unknown, type: "text" | "html" | "email" | "nickname" | "url"): string {
  if (input === null || input === undefined) {
    return "";
  }

  const stringInput = String(input);

  // Detectar contenido malicioso primero
  if (detectMaliciousContent(stringInput)) {
    throw new Error("Contenido potencialmente malicioso detectado");
  }

  switch (type) {
    case "text":
      return sanitizeText(stringInput);
    case "html":
      return sanitizeHTML(stringInput);
    case "email":
      return sanitizeEmail(stringInput);
    case "nickname":
      return sanitizeNickname(stringInput);
    case "url":
      return sanitizeURL(stringInput) || "";
    default:
      return sanitizeText(stringInput);
  }
}