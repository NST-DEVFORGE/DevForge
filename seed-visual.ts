import { config } from "dotenv"; config({ path: ".env.local" });
import { club, COLLECTIONS } from "./lib/firebase/collections";
import { hashPassword } from "./lib/auth";
(async () => {
  await club(COLLECTIONS.members).doc("UI-PREVIEW").set({
    usn: "UI-PREVIEW", name: "Preview Member", email: "noreply@example.invalid",
    role: "admin", status: "approved",
    passwordHash: await hashPassword("preview-Password-123!"),
    mustChangePassword: false, points: 0, badges: 0, joinedAt: new Date().toISOString(),
  });
  console.log("preview member ready"); process.exit(0);
})();
