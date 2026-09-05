import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProjectCategory extends Document {
  name: string;
  slug: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectCategorySchema = new Schema<IProjectCategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
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

export const ProjectCategory: Model<IProjectCategory> =
  mongoose.models.ProjectCategory ||
  mongoose.model<IProjectCategory>("ProjectCategory", ProjectCategorySchema);

export default ProjectCategory;
