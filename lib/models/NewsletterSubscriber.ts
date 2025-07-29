import mongoose from "mongoose";

const NewsletterSubscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    categories: [
      {
        type: String,
        enum: ["personal", "startup", "all"],
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    lastEmailSent: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas eficientes
NewsletterSubscriberSchema.index({ isActive: 1, categories: 1 });

export default mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", NewsletterSubscriberSchema);
