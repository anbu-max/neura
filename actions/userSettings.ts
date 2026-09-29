"use server";

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "@/firebaseAdmin";
import { revalidatePath } from "next/cache";

export interface UserSettingsData {
  displayName?: string;
  openAiKey?: string;
  useCustomKey?: boolean;
  darkMode?: boolean;
  region?: string;
  bio?: string;
}

export interface UserMemoryItem {
  id: string;
  category: string;
  content: string;
  createdAt?: string | Date;
}

/**
 * Fetch current user settings from Firestore
 */
export async function getUserSettings(): Promise<UserSettingsData> {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  try {
    const docSnap = await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("settings")
      .doc("profile")
      .get();

    if (!docSnap.exists) {
      return {
        displayName: "",
        openAiKey: "",
        useCustomKey: false,
        darkMode: false,
        region: "India / Global",
        bio: "",
      };
    }

    const data = docSnap.data() as UserSettingsData;
    // Mask key if present for client security
    const maskedKey = data.openAiKey
      ? data.openAiKey.length > 8
        ? `${data.openAiKey.slice(0, 4)}...${data.openAiKey.slice(-4)}`
        : "••••••••"
      : "";

    return {
      displayName: data.displayName || "",
      openAiKey: maskedKey,
      useCustomKey: Boolean(data.useCustomKey),
      darkMode: Boolean(data.darkMode),
      region: data.region || "India / Global",
      bio: data.bio || "",
    };
  } catch (err) {
    console.warn("Could not fetch user settings:", err);
    return {};
  }
}

/**
 * Save user settings (BYOK OpenAI Key, Display Name, Region, etc.)
 */
export async function saveUserSettings(settings: {
  displayName?: string;
  openAiKey?: string;
  useCustomKey?: boolean;
  darkMode?: boolean;
  region?: string;
  bio?: string;
}) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  try {
    const docRef = adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("settings")
      .doc("profile");

    const updatePayload: Record<string, any> = {
      updatedAt: new Date(),
    };

    if (settings.displayName !== undefined) updatePayload.displayName = settings.displayName;
    if (settings.useCustomKey !== undefined) updatePayload.useCustomKey = settings.useCustomKey;
    if (settings.darkMode !== undefined) updatePayload.darkMode = settings.darkMode;
    if (settings.region !== undefined) updatePayload.region = settings.region;
    if (settings.bio !== undefined) updatePayload.bio = settings.bio;

    // Only update key if user actually typed a new one (not the masked version)
    if (settings.openAiKey && !settings.openAiKey.includes("...")) {
      updatePayload.openAiKey = settings.openAiKey.trim();
    } else if (settings.openAiKey === "") {
      updatePayload.openAiKey = "";
    }

    await docRef.set(updatePayload, { merge: true });
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Failed to save settings:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch all stored memories for the user
 */
export async function getUserMemories(): Promise<UserMemoryItem[]> {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  try {
    const snap = await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("memories")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    return snap.docs.map((d) => ({
      id: d.id,
      category: d.data().category || "general",
      content: d.data().content || "",
      createdAt: d.data().createdAt?.toDate?.() || new Date(),
    }));
  } catch (err) {
    console.warn("Could not fetch memories:", err);
    return [];
  }
}

/**
 * Save a batch of memories (e.g. from Onboarding or Settings form)
 */
export async function saveUserMemories(
  memories: Array<{ category: string; content: string }>
) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  try {
    const memCol = adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("memories");

    const batch = adminDb.batch();

    for (const mem of memories) {
      if (!mem.content || !mem.content.trim()) continue;
      const newRef = memCol.doc();
      batch.set(newRef, {
        category: mem.category,
        content: mem.content.trim(),
        createdAt: new Date(),
      });
    }

    await batch.commit();
    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Error saving memories batch:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Delete a specific memory
 */
export async function deleteUserMemory(memoryId: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  try {
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("memories")
      .doc(memoryId)
      .delete();

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Process uploaded user profile file / bio document
 * Extracts key personal information and saves as autobiographical memories
 */
export async function uploadUserProfileFile(fileContent: string, fileName: string) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  try {
    if (!fileContent || !fileContent.trim()) {
      return { success: false, error: "Uploaded file is empty." };
    }

    // Save as primary bio in settings
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("settings")
      .doc("profile")
      .set(
        {
          uploadedBioFileName: fileName,
          bio: fileContent.slice(0, 5000), // first 5000 chars as instant profile bio
          updatedAt: new Date(),
        },
        { merge: true }
      );

    // Save as a high-priority autobiographical memory document
    await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("memories")
      .add({
        category: "uploaded_profile",
        content: `Personal Profile from "${fileName}": ${fileContent.slice(0, 1500).replace(/\s+/g, " ")}`,
        createdAt: new Date(),
      });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (err: any) {
    console.error("Error processing profile file:", err);
    return { success: false, error: err.message };
  }
}
