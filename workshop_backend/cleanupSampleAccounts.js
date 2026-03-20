#!/usr/bin/env node
/**
 * cleanupSampleAccounts.js
 * ─────────────────────────────────────────────────────────────────
 * Removes test / sample accounts from the live MongoDB Atlas instance.
 *
 * USAGE
 *   node cleanupSampleAccounts.js             ← DRY RUN (safe default)
 *   node cleanupSampleAccounts.js --confirm   ← Actually deletes
 *
 * The script targets accounts whose email or name matches common
 * test patterns. Review the printed list before running with --confirm.
 * ─────────────────────────────────────────────────────────────────
 */

import mongoose from "mongoose";
import dotenv   from "dotenv";
import path     from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

/* ── Patterns that flag a test / sample account ── */
const EMAIL_PATTERNS = [
  /^test/i,
  /test@/i,
  /sample/i,
  /dummy/i,
  /demo@/i,
  /^admin@test\./i,
  /^admin@example\./i,
  /example\.com$/i,
  /placeholder/i,
  /fake/i,
  /noreply/i,
];

const NAME_PATTERNS = [
  /^test\s/i,
  /^sample\s/i,
  /^dummy/i,
  /^demo/i,
  /placeholder/i,
];

const DRY_RUN = !process.argv.includes("--confirm");

const UserSchema = new mongoose.Schema(
  { name: String, email: String, password: String, role: String },
  { timestamps: true }
);
const User = mongoose.model("User", UserSchema);

async function main() {
  if (!process.env.MONGO_URI) {
    console.error("❌  MONGO_URI not found in .env — aborting.");
    process.exit(1);
  }

  console.log("🔗  Connecting to MongoDB Atlas…");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected.\n");

  /* Fetch all users — filter in-process to use regex patterns */
  const all = await User.find({}).lean();

  const targets = all.filter((u) => {
    const emailMatch = EMAIL_PATTERNS.some((p) => p.test(u.email || ""));
    const nameMatch  = NAME_PATTERNS.some((p)  => p.test(u.name  || ""));
    return emailMatch || nameMatch;
  });

  if (targets.length === 0) {
    console.log("✅  No sample / test accounts found. Database is clean!");
    await mongoose.disconnect();
    return;
  }

  console.log(`⚠️  Found ${targets.length} account(s) matching test patterns:\n`);
  console.log("  #  | Role    | Email                          | Name");
  console.log("  ───────────────────────────────────────────────────────────");
  targets.forEach((u, i) => {
    const idx   = String(i + 1).padStart(3);
    const role  = (u.role || "?").padEnd(7);
    const email = (u.email || "").padEnd(30);
    console.log(`  ${idx} | ${role} | ${email} | ${u.name || ""}`);
  });

  if (DRY_RUN) {
    console.log("\n🛡️  DRY RUN — no accounts deleted.");
    console.log("   Run with --confirm to permanently delete the accounts above.\n");
  } else {
    const ids = targets.map((u) => u._id);
    const result = await User.deleteMany({ _id: { $in: ids } });
    console.log(`\n🗑️  Deleted ${result.deletedCount} account(s) from the database.\n`);
  }

  await mongoose.disconnect();
  console.log("🔌  Disconnected. Done.");
}

main().catch((err) => {
  console.error("❌  Fatal error:", err.message);
  process.exit(1);
});
