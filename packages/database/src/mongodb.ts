import path from "path";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

// Pre-load environment variables for standalone script execution
if (typeof process !== "undefined" && process.cwd) {
  try {
    dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
    dotenv.config({ path: path.resolve(process.cwd(), ".env") });
  } catch {}
}

const uri =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/myportfolio";

const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = globalWithMongo._mongoClient.connect();
  }
  client = globalWithMongo._mongoClient;
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export { client, clientPromise };
export default clientPromise;
