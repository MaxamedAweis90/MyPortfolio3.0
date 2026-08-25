import mongoose from "mongoose";

/**
 * Global cache interface for Mongoose in NodeJS global scope
 * to preserve database connections across Next.js Hot Module Replacement (HMR).
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB Atlas using Mongoose with a singleton caching pattern.
 * Prevents connection leaks during development and reuses connections in serverless execution.
 * 
 * @returns Promise<typeof mongoose> - Connected Mongoose instance
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = "❌ [MongoDB] MONGODB_URI is not defined in environment variables (.env.local).";
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Return existing active connection
  if (cached.conn) {
    return cached.conn;
  }

  // Create new connection promise if none is in flight
  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    console.log("⏳ [MongoDB] Connecting to MongoDB Atlas (cluster: ugaas)...");

    cached.promise = mongoose
      .connect(uri, opts)
      .then((mongooseInstance) => {
        console.log("✅ [MongoDB] Successfully connected to database (myportfolio).");
        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ [MongoDB] Database connection error:", error);
        cached.promise = null;
        throw error;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase;
