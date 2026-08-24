import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICertificate extends Document {
  title: string;
  issuer: string;
  code?: string;
  link?: string;
  image?: string;
  category: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CertificateSchema = new Schema<ICertificate>(
  {
    title: {
      type: String,
      required: [true, "Certificate title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer organization is required"],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      default: "Certification",
      trim: true,
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

export const Certificate: Model<ICertificate> =
  mongoose.models.Certificate ||
  mongoose.model<ICertificate>("Certificate", CertificateSchema);

export default Certificate;
