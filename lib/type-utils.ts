/**
 * Utilidades de tipos para mejorar la seguridad de tipos en TypeScript
 */

// Tipo para asegurar que un objeto tiene todas las propiedades requeridas
export type RequiredKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Tipo para hacer propiedades específicas opcionales
export type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Tipo para valores no nulos/undefined
export type NonNullable<T> = T extends null | undefined ? never : T;

// Tipo para arrays no vacíos
export type NonEmptyArray<T> = [T, ...T[]];

// Tipo para strings no vacíos
export type NonEmptyString = string & { readonly __brand: unique symbol };

// Función para validar string no vacío
export function isNonEmptyString(value: string): value is NonEmptyString {
  return value.trim().length > 0;
}

// Función para crear string no vacío de forma segura
export function createNonEmptyString(value: string): NonEmptyString | null {
  return isNonEmptyString(value) ? value as NonEmptyString : null;
}

// Tipo para IDs válidos
export type ValidId = string & { readonly __brand: unique symbol };

// Función para validar ID
export function isValidId(value: string): value is ValidId {
  return /^[a-zA-Z0-9_-]+$/.test(value) && value.length > 0;
}

// Tipo para emails válidos
export type ValidEmail = string & { readonly __brand: unique symbol };

// Función para validar email
export function isValidEmail(value: string): value is ValidEmail {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

// Tipo para URLs válidas
export type ValidURL = string & { readonly __brand: unique symbol };

// Función para validar URL
export function isValidURL(value: string): value is ValidURL {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

// Tipo para fechas válidas
export type ValidDate = Date & { readonly __brand: unique symbol };

// Función para validar fecha
export function isValidDate(value: Date): value is ValidDate {
  return value instanceof Date && !isNaN(value.getTime());
}

// Función para crear fecha válida
export function createValidDate(value: string | number | Date): ValidDate | null {
  const date = new Date(value);
  return isValidDate(date) ? date as ValidDate : null;
}

// Tipo para resultados de operaciones que pueden fallar
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Función helper para crear resultado exitoso
export function success<T>(data: T): Result<T, never> {
  return { success: true, data };
}

// Función helper para crear resultado de error
export function failure<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// Función para manejar resultados de forma segura
export function handleResult<T, E, R>(
  result: Result<T, E>,
  onSuccess: (data: T) => R,
  onError: (error: E) => R
): R {
  if (result.success) {
    return onSuccess(result.data);
  } else {
    return onError(result.error);
  }
}

// Tipo para configuración de API
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

// Función para crear respuesta de API exitosa
export function createApiSuccess<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    message,
    status: 200,
  };
}

// Función para crear respuesta de API con error
export function createApiError(error: string, status: number = 400): ApiResponse<never> {
  return {
    error,
    status,
  };
}

// Tipo para paginación
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

// Tipo para respuesta paginada
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Función para crear parámetros de paginación
export function createPaginationParams(page: number = 1, limit: number = 10): PaginationParams {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.max(1, Math.min(100, limit)); // Máximo 100 items por página

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset: (normalizedPage - 1) * normalizedLimit,
  };
}

// Función para crear respuesta paginada
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  params: PaginationParams
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / params.limit);

  return {
    data,
    pagination: {
      page: params.page,
      limit: params.limit,
      total,
      totalPages,
      hasNext: params.page < totalPages,
      hasPrev: params.page > 1,
    },
  };
}

// Tipo para configuración de cache
export interface CacheConfig {
  ttl: number; // Time to live en segundos
  key: string;
  tags?: string[];
}

// Función para crear configuración de cache
export function createCacheConfig(key: string, ttl: number = 300, tags?: string[]): CacheConfig {
  return {
    key,
    ttl,
    tags,
  };
}