import connectDB from "./mongodb";
import Comment from "./models/Comment";
import NewsletterSubscriber from "./models/NewsletterSubscriber";
import {
  Comment as CommentType,
  NewsletterSubscriber as NewsletterSubscriberType,
} from "./types";

// Comentarios
export async function addComment(
  comment: Omit<CommentType, "id" | "createdAt" | "isApproved">
): Promise<CommentType> {
  await connectDB();

  const newComment = new Comment({
    postId: comment.postId,
    nickname: comment.nickname,
    content: comment.content,
  });

  const savedComment = await newComment.save();

  return {
    id: savedComment._id.toString(),
    postId: savedComment.postId,
    nickname: savedComment.nickname,
    content: savedComment.content,
    createdAt: savedComment.createdAt.toISOString(),
    isApproved: savedComment.isApproved,
  };
}

export async function getComments(postId: string): Promise<CommentType[]> {
  await connectDB();

  const comments = await Comment.find({
    postId,
    isApproved: true,
  })
    .sort({ createdAt: -1 })
    .lean();

  return comments.map((comment: any) => ({
    id: comment._id.toString(),
    postId: comment.postId,
    nickname: comment.nickname,
    content: comment.content,
    createdAt: comment.createdAt.toISOString(),
    isApproved: comment.isApproved,
  }));
}

// Newsletter
export async function addSubscriber(
  email: string,
  categories: ("personal" | "startup" | "all")[]
): Promise<NewsletterSubscriberType> {
  await connectDB();

  // Verificar si ya existe
  const existingSubscriber = await NewsletterSubscriber.findOne({ email });

  if (existingSubscriber) {
    // Actualizar categorías si ya existe
    existingSubscriber.categories = categories;
    existingSubscriber.isActive = true;
    await existingSubscriber.save();

    return {
      id: existingSubscriber._id.toString(),
      email: existingSubscriber.email,
      categories: existingSubscriber.categories,
      isActive: existingSubscriber.isActive,
      subscribedAt: existingSubscriber.subscribedAt.toISOString(),
    };
  }

  const newSubscriber = new NewsletterSubscriber({
    email,
    categories,
  });

  const savedSubscriber = await newSubscriber.save();

  return {
    id: savedSubscriber._id.toString(),
    email: savedSubscriber.email,
    categories: savedSubscriber.categories,
    isActive: savedSubscriber.isActive,
    subscribedAt: savedSubscriber.subscribedAt.toISOString(),
  };
}

export async function getSubscribers(
  category?: "personal" | "startup" | "all"
): Promise<NewsletterSubscriberType[]> {
  await connectDB();

  const query: any = { isActive: true };

  if (category) {
    query.categories = { $in: [category, "all"] };
  }

  const subscribers = await NewsletterSubscriber.find(query).lean();

  return subscribers.map((subscriber: any) => ({
    id: subscriber._id.toString(),
    email: subscriber.email,
    categories: subscriber.categories,
    isActive: subscriber.isActive,
    subscribedAt: subscriber.subscribedAt.toISOString(),
  }));
}

export async function unsubscribe(email: string): Promise<boolean> {
  await connectDB();

  const subscriber = await NewsletterSubscriber.findOne({ email });
  if (!subscriber) return false;

  subscriber.isActive = false;
  await subscriber.save();

  return true;
}

// Función para obtener estadísticas
export async function getStats() {
  await connectDB();

  const [totalComments, totalSubscribers, activeSubscribers] =
    await Promise.all([
      Comment.countDocuments(),
      NewsletterSubscriber.countDocuments(),
      NewsletterSubscriber.countDocuments({ isActive: true }),
    ]);

  return {
    totalComments,
    totalSubscribers,
    activeSubscribers,
  };
}
