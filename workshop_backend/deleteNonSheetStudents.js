/**
 * deleteNonSheetStudents.js
 * Deletes all student accounts in MongoDB whose email is NOT in the Google Sheet.
 * Admin accounts are never touched.
 * Safe: defaults to dry-run. Pass --confirm to actually delete.
 */
import mongoose from "mongoose";
import axios    from "axios";
import dotenv   from "dotenv";
import path     from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const SHEET_URL =
  "https://opensheet.elk.sh/1ukomuNdIHHhrmETeZgUNuYuVFYsCG4b-CqdkNw1VTBY/participant_rows";

const DRY_RUN = !process.argv.includes("--confirm");

const UserSchema = new mongoose.Schema(
  { name: String, email: String, role: String },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected\n");

  // Fetch authoritative email list from Google Sheet
  const { data: rows } = await axios.get(SHEET_URL);
  const sheetEmails = new Set(rows.map((r) => r.email?.trim().toLowerCase()));
  console.log(`📋  Google Sheet has ${sheetEmails.size} participants\n`);

  // Find all students in DB whose email is NOT in the sheet
  const allStudents = await User.find({ role: "student" }).lean();
  const toDelete    = allStudents.filter((u) => !sheetEmails.has(u.email?.toLowerCase()));
  const toKeep      = allStudents.filter((u) =>  sheetEmails.has(u.email?.toLowerCase()));

  console.log(`✅  Keeping  ${toKeep.length} sheet-verified student(s)`);
  console.log(`🗑️  Removing ${toDelete.length} sample/unverified student(s):\n`);
  toDelete.forEach((u) => console.log(`   - ${u.email}  (${u.name})`));

  if (toDelete.length === 0) {
    console.log("\nDatabase already clean!");
    await mongoose.disconnect();
    return;
  }

  if (DRY_RUN) {
    console.log("\n🛡️  DRY RUN — no changes made. Run with --confirm to delete.\n");
  } else {
    const ids = toDelete.map((u) => u._id);
    const { deletedCount } = await User.deleteMany({ _id: { $in: ids } });
    console.log(`\n✅  Deleted ${deletedCount} account(s).\n`);
  }

  await mongoose.disconnect();
  console.log("Done.");
}

main().catch((e) => { console.error("❌", e.message); process.exit(1); });
