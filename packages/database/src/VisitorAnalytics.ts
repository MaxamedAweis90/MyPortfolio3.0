import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVisitorAnalytics extends Document {
  path: string;
  ipAddress: string;
  userAgent: string;
  device: {
    type: "desktop" | "mobile" | "tablet" | "unknown";
    os: string;
    browser: string;
  };
  location: {
    country: string;
    city: string;
    region?: string;
  };
  duration: number; // in seconds
  referrer?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VisitorAnalyticsSchema = new Schema<IVisitorAnalytics>(
  {
    path: { type: String, required: true, index: true },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "" },
    device: {
      type: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "unknown"],
        default: "desktop",
      },
      os: { type: String, default: "Windows" },
      browser: { type: String, default: "Chrome" },
    },
    location: {
      country: { type: String, default: "United States" },
      city: { type: String, default: "San Francisco" },
      region: { type: String, default: "California" },
    },
    duration: { type: Number, default: 168 },
    referrer: { type: String, default: "direct" },
  },
  {
    timestamps: true,
  }
);

// Compound index for timeline aggregation
VisitorAnalyticsSchema.index({ createdAt: -1, path: 1 });
VisitorAnalyticsSchema.index({ "location.country": 1 });

export const VisitorAnalytics: Model<IVisitorAnalytics> =
  mongoose.models.VisitorAnalytics ||
  mongoose.model<IVisitorAnalytics>("VisitorAnalytics", VisitorAnalyticsSchema);

export default VisitorAnalytics;
