import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Lead from '../models/Lead.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const seedDatabaseIfEmpty = async (force = false) => {
  try {
    const count = await Lead.countDocuments();
    if (count > 0 && !force) {
      console.log(`[DB] Database already populated with ${count} leads. Skipping auto-seed.`);
      return;
    }

    if (force) {
      await Lead.deleteMany({});
      console.log(`[DB] Force reset: Cleared existing leads collection.`);
    }

    // Resolve path to data/leads.json
    const leadsJsonPath = path.resolve(__dirname, '../../data/leads.json');
    if (!fs.existsSync(leadsJsonPath)) {
      console.warn(`[DB] Seed file not found at ${leadsJsonPath}`);
      return;
    }

    const rawData = fs.readFileSync(leadsJsonPath, 'utf-8');
    const leadsData = JSON.parse(rawData);

    if (Array.isArray(leadsData) && leadsData.length > 0) {
      await Lead.insertMany(leadsData);
      console.log(`[DB] Successfully seeded ${leadsData.length} leads into the database.`);
    }
  } catch (err) {
    console.error(`[DB] Error seeding database:`, err);
  }
};
