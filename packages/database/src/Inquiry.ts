import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInquiry extends Document {
  projectName: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget?: string;
  deadline?: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Client name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    projectType: {
      type: String,
      required: [true, "Project type is required"],
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    deadline: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
  },
  {
    timestamps: true,
  }
);

export const Inquiry: Model<IInquiry> =
  mongoose.models.Inquiry || mongoose.model<IInquiry>("Inquiry", InquirySchema);

export default Inquiry;
