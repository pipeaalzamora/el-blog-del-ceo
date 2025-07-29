import { z } from "zod";
import { sanitizeInput, detectMaliciousContent } from "./sanitization";

// Validación para comentarios con sanitización
export const CommentSchema = z.object({
  postId: z.string().min(1, "Post ID es requerido"),
  nickname: z
    .string()
    .min(1, "Nickname es requerido")
    .max(30, "Nickname no puede exceder 30 caracteres")
    .transform((val) => sanitizeInput(val, "nickname"))
    .refine((val) => !detectMaliciousContent(val), {
      message: "Nickname contiene contenido no permitido"
    }),
  content: z
    .string()
    .min(1, "Contenido es requerido")
    .max(1000, "Contenido no puede exceder 1000 caracteres")
    .transform((val) => sanitizeInput(val, "text"))
    .refine((val) => !detectMaliciousContent(val), {
      message: "Contenido contiene elementos no permitidos"
    }),
});

// Validación para suscriptores del newsletter con sanitización
export const NewsletterSubscriberSchema = z.object({
  email: z
    .string()
    .email("Email no válido")
    .transform((val) => sanitizeInput(val, "email"))
    .refine((val) => !detectMaliciousContent(val), {
      message: "Email contiene caracteres no permitidos"
    }),
  categories: z
    .array(z.enum(["personal", "startup", "all"]))
    .min(1, "Debe seleccionar al menos una categoría")
    .refine(
      (categories) => {
        // Si incluye "all", no debe incluir otras categorías
        if (categories.includes("all") && categories.length > 1) {
          return false;
        }
        return true;
      },
      {
        message: "Si selecciona 'Todos', no puede seleccionar otras categorías",
      }
    ),
});

// Validación para unsubscribe con sanitización
export const UnsubscribeSchema = z.object({
  email: z
    .string()
    .email("Email no válido")
    .transform((val) => sanitizeInput(val, "email")),
});

// Validación para búsqueda
export const SearchSchema = z.object({
  query: z.string().min(1, "Query de búsqueda es requerido").max(100, "Query muy largo"),
  category: z.enum(["personal", "startup"]).optional(),
});

// Tipos derivados de los schemas
export type CommentInput = z.infer<typeof CommentSchema>;
export type NewsletterSubscriberInput = z.infer<typeof NewsletterSubscriberSchema>;
export type UnsubscribeInput = z.infer<typeof UnsubscribeSchema>;
export type SearchInput = z.infer<typeof SearchSchema>;