import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: string;
  desc: string;
  fullDesc?: string;
  liveUrl?: string;
  githubUrl?: string;
  clientUrl?: string;
  serverUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  appIconUrl?: string;
  apkUrl?: string;
  screenshots?: string[];
  images?: string[];
  image: string;
  tools: string[];
  isFeatured: boolean;
  order: number;
  projectNumber?: number;
  sortOrder?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Project slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      default: "Web",
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
    },
    fullDesc: {
      type: String,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    clientUrl: {
      type: String,
      trim: true,
    },
    serverUrl: {
      type: String,
      trim: true,
    },
    playStoreUrl: {
      type: String,
      trim: true,
    },
    appStoreUrl: {
      type: String,
      trim: true,
    },
    appIconUrl: {
      type: String,
      trim: true,
    },
    apkUrl: {
      type: String,
      trim: true,
    },
    screenshots: {
      type: [String],
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, "Project image URL is required"],
      trim: true,
    },
    tools: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
    projectNumber: {
      type: Number,
      index: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

// Invalidate cached model if created before projectNumber was added to schema
if (mongoose.models && mongoose.models.Project) {
  if (!mongoose.models.Project.schema.paths.projectNumber) {
    delete (mongoose.models as any).Project;
  }
}

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
