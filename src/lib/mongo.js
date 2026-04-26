import mongoose from 'mongoose';

let cached = global._pineappleMongoose;
if (!cached) cached = global._pineappleMongoose = { conn: null, promise: null };

export async function connectMongo() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    mongoose.set('strictQuery', false);
    cached.promise = mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
