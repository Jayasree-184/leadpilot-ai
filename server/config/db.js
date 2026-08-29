import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      console.log(`[DB] Attempting connection to configured MONGODB_URI...`);
      await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`[DB] Successfully connected to MongoDB database.`);
      return;
    } catch (err) {
      console.warn(`[DB] Failed to connect to MONGODB_URI: ${err.message}. Falling back to embedded in-memory MongoDB...`);
    }
  } else {
    console.log(`[DB] No MONGODB_URI provided. Initializing in-memory embedded MongoDB...`);
  }

  try {
    mongoMemoryServer = await MongoMemoryServer.create();
    const memUri = mongoMemoryServer.getUri();
    await mongoose.connect(memUri);
    console.log(`[DB] In-memory MongoDB successfully initialized at ${memUri}`);
  } catch (memErr) {
    console.error(`[DB] Fatal error initializing in-memory database:`, memErr);
    throw memErr;
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
