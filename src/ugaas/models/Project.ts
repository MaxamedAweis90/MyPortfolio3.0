import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  slug: string;
  category: "All" | "Web" | "Mobile" | "Design";
  desc: string;
  fullDesc?: string;
  liveUrl?: string;
  githubUrl?: string;
  clientUrl?: string;
  serverUrl?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  image: string;
  tools: string[];
  isFeatured: boolean;
  order: number;
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
      enum: ["All", "Web", "Mobile", "Design"],
      default: "Web",
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
  },
  {
    timestamps: true,
  }
);

export const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
