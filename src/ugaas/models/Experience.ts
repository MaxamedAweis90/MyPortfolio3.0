import mongoose, { Schema, Document, Model } from "mongoose";

export interface IExperience extends Document {
  role: string;
  company: string;
  duration: string;
  badges: string[];
  highlights: string[];
  techStack: string[];
  type: "career" | "education" | "certification";
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role: {
      type: String,
      required: [true, "Role or degree title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company or institution name is required"],
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },
    badges: {
      type: [String],
      default: [],
    },
    highlights: {
      type: [String],
      default: [],
    },
    techStack: {
      type: [String],
      default: [],
    },
    type: {
      type: String,
      enum: ["career", "education", "certification"],
      default: "career",
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

export const Experience: Model<IExperience> =
  mongoose.models.Experience ||
  mongoose.model<IExperience>("Experience", ExperienceSchema);

export default Experience;
