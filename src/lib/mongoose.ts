import mongoose from "mongoose";

// Reuse the connection across Next.js serverless invocations where possible.
type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

global.mongooseCache = cache;

export async function connectToDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new Error(
      "MONGODB_URI is not configured. Add the MongoDB Atlas connection string to the Vercel project Environment Variables and redeploy."
    );
  }

  if (cache.conn && mongoose.connection.readyState === 1) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 10,
        bufferCommands: false,
      })
      .then((connected) => connected)
      .catch((error: unknown) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
