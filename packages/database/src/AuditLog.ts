import mongoose, { Schema, Document, Model } from "mongoose";

export type AuditLogCategory =
  | "projects"
  | "experience"
  | "inquiries"
  | "settings"
  | "auth"
  | "system";

export interface IAuditLog extends Document {
  action: string;
  category: AuditLogCategory;
  description: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  actorEmail: string;
  ipAddress: string;
  userAgent: string;
  device: {
    type: "desktop" | "mobile" | "tablet" | "unknown";
    os: string;
    browser: string;
    name?: string;
  };
  location: {
    city?: string;
    country?: string;
    region?: string;
    ip?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AuditLogSchema: Schema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ["projects", "experience", "inquiries", "settings", "auth", "system"],
      index: true,
    },
    description: { type: String, required: true },
    resourceId: { type: String },
    resourceName: { type: String },
    details: { type: Schema.Types.Mixed, default: {} },
    actorEmail: { type: String, default: "admin@ugaas.dev", index: true },
    ipAddress: { type: String, default: "127.0.0.1" },
    userAgent: { type: String, default: "" },
    device: {
      type: {
        type: String,
        enum: ["desktop", "mobile", "tablet", "unknown"],
        default: "desktop",
      },
      os: { type: String, default: "Unknown OS" },
      browser: { type: String, default: "Unknown Browser" },
      name: { type: String, default: "" },
    },
    location: {
      city: { type: String, default: "Localhost" },
      country: { type: String, default: "Development" },
      region: { type: String, default: "" },
      ip: { type: String, default: "127.0.0.1" },
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast timeline queries
AuditLogSchema.index({ category: 1, createdAt: -1 });
AuditLogSchema.index({ createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  mongoose.models.AuditLog ||
  mongoose.model<IAuditLog>("AuditLog", AuditLogSchema);

export default AuditLog;
