import { Comment, NewsletterSubscriber } from "./types";

// Función para verificar si estamos en el navegador
const isBrowser = typeof window !== "undefined";

// Función para obtener datos de localStorage
function getFromStorage(key: string): any {
  if (!isBrowser) return null;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

// Función para guardar datos en localStorage
function setToStorage(key: string, value: any): void {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error guardando en localStorage:", error);
  }
}

// Comentarios
export async function addComment(
  comment: Omit<Comment, "id" | "createdAt" | "isApproved">
): Promise<Comment> {
  const id = `comment:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const newComment: Comment = {
    ...comment,
    id,
    createdAt: new Date().toISOString(),
    isApproved: true, // Por ahora aprobamos todos, después podemos agregar moderación
  };

  // Guardar en localStorage
  const key = `post:${comment.postId}:comments`;
  const existingComments = getFromStorage(key) || {};
  existingComments[id] = newComment;
  setToStorage(key, existingComments);

  return newComment;
}

export async function getComments(postId: string): Promise<Comment[]> {
  // Obtener de localStorage
  const key = `post:${postId}:comments`;
  const comments = getFromStorage(key) || {};

  const commentsArray = Object.values(comments) as any[];
  return commentsArray
    .filter((comment: any) => comment && comment.isApproved)
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

// Newsletter
export async function addSubscriber(
  email: string,
  categories: ("personal" | "startup" | "all")[]
): Promise<NewsletterSubscriber> {
  const id = `subscriber:${Date.now()}:${Math.random().toString(36).substr(2, 9)}`;
  const subscriber: NewsletterSubscriber = {
    id,
    email,
    categories,
    isActive: true,
    subscribedAt: new Date().toISOString(),
  };

  // Guardar en localStorage
  const key = "newsletter:subscribers";
  const existingSubscribers = getFromStorage(key) || {};
  existingSubscribers[email] = subscriber;
  setToStorage(key, existingSubscribers);

  return subscriber;
}

export async function getSubscribers(
  category?: "personal" | "startup" | "all"
): Promise<NewsletterSubscriber[]> {
  // Obtener de localStorage
  const key = "newsletter:subscribers";
  const subscribers = getFromStorage(key) || {};

  const subscribersArray = Object.values(subscribers) as any[];
  const allSubscribers = subscribersArray.filter(
    (subscriber: any) => subscriber && subscriber.isActive
  );

  if (!category) return allSubscribers;

  return allSubscribers.filter(
    (subscriber: any) =>
      subscriber.categories.includes(category) ||
      subscriber.categories.includes("all")
  );
}

export async function unsubscribe(email: string): Promise<boolean> {
  // Obtener de localStorage
  const key = "newsletter:subscribers";
  const subscribers = getFromStorage(key) || {};

  if (!subscribers[email]) return false;

  const subscriberData = subscribers[email];
  subscriberData.isActive = false;

  subscribers[email] = subscriberData;
  setToStorage(key, subscribers);

  return true;
}

// Función para exportar datos (útil para migración)
export function exportData(): any {
  return {
    comments: getFromStorage("comments"),
    subscribers: getFromStorage("newsletter:subscribers"),
  };
}

// Función para importar datos (útil para migración)
export function importData(data: any): void {
  if (data.comments) {
    setToStorage("comments", data.comments);
  }
  if (data.subscribers) {
    setToStorage("newsletter:subscribers", data.subscribers);
  }
}
