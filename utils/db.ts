import mongoose, { Mongoose } from "mongoose"

export type MongooseCache = {
  conn: Mongoose | null
  promise: Promise<Mongoose> | null
}

declare global {
  // allow global `mongoose` cache in dev mode
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null }

mongoose.set("strictQuery", false)

export const connectToDatabase = async (): Promise<Mongoose> => {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local",
    )
  }

  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, { bufferCommands: false })
  }

  cached.conn = await cached.promise
  global.mongoose = cached

  return cached.conn
}
