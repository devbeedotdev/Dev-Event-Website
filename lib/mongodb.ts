import mongoose, { ConnectOptions, Mongoose } from "mongoose";

/**
 * Typed cache for the Mongoose connection to prevent multiple
 * connections during development (Next.js hot-reloading).
 */
type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local",
  );
}

// Use a global variable so that the value is preserved across module reloads
// in development. This prevents creating new connections on every hot reload.
const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

/**
 * Connects to MongoDB using Mongoose and returns the active Mongoose instance.
 * Caches the connection Promise and instance to avoid duplicate connections.
 */
export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
    } as ConnectOptions;

    cached.promise = mongoose.connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn as Mongoose;
}

/**
 * Export the mongoose singleton for direct access to models and utilities.
 * Prefer using `connectToDatabase()` in server entrypoints to ensure the
 * connection is established before performing DB operations.
 */
export { mongoose };
