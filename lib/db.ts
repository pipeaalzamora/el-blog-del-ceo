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
  try {
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
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
}

export async function getComments(postId: string): Promise<CommentType[]> {
  try {
    await connectDB();

    const comments = await Comment.find({
      postId,
      isApproved: true,
    })
      .sort({ createdAt: -1 })
      .lean();

    return comments.map((comment: Record<string, unknown>) => ({
      id: (comment._id as { toString(): string }).toString(),
      postId: comment.postId as string,
      nickname: comment.nickname as string,
      content: comment.content as string,
      createdAt: (comment.createdAt as Date).toISOString(),
      isApproved: comment.isApproved as boolean,
    }));
  } catch (error) {
    console.error("Error getting comments:", error);
    return [];
  }
}

// Newsletter
export async function addSubscriber(
  email: string,
  categories: ("personal" | "startup" | "all")[]
): Promise<NewsletterSubscriberType> {
  try {
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
  } catch (error) {
    console.error("Error adding subscriber:", error);
    throw new Error("Failed to add subscriber");
  }
}

export async function getSubscribers(
  category?: "personal" | "startup" | "all"
): Promise<NewsletterSubscriberType[]> {
  try {
    await connectDB();

    const query: Record<string, unknown> = { isActive: true };

    if (category) {
      query.categories = { $in: [category, "all"] };
    }

    const subscribers = await NewsletterSubscriber.find(query).lean();

    return subscribers.map((subscriber: Record<string, unknown>) => ({
      id: (subscriber._id as { toString(): string }).toString(),
      email: subscriber.email as string,
      categories: subscriber.categories as ("personal" | "startup" | "all")[],
      isActive: subscriber.isActive as boolean,
      subscribedAt: (subscriber.subscribedAt as Date).toISOString(),
    }));
  } catch (error) {
    console.error("Error getting subscribers:", error);
    return [];
  }
}

export async function unsubscribe(email: string): Promise<boolean> {
  try {
    await connectDB();

    const subscriber = await NewsletterSubscriber.findOne({ email });
    if (!subscriber) return false;

    subscriber.isActive = false;
    await subscriber.save();

    return true;
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return false;
  }
}

// Función para obtener estadísticas
export async function getStats() {
  try {
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
  } catch (error) {
    console.error("Error getting stats:", error);
    return {
      totalComments: 0,
      totalSubscribers: 0,
      activeSubscribers: 0,
    };
  }
}