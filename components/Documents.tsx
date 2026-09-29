import { adminDb } from "@/firebaseAdmin";
import PlaceholderDocument from "./PlaceholderDocument";
import { auth } from "@clerk/nextjs/server";
import Document from "./Document";
import { FileText, Youtube, MessageSquare } from "lucide-react";

export interface HistoryItem {
  id: string;
  name: string;
  downloadUrl: string;
  size: number;
  createdAt: Date;
  chatCount: number;
  type: "pdf" | "youtube";
  lastMessage?: string;
}

async function Documents() {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  const docMap = new Map<string, any>();
  const historyItems: HistoryItem[] = [];

  try {
    // 1. Fetch from active user's documents
    const userDocRef = adminDb.collection("users").doc(effectiveUserId);
    const documentsSnapshot = await userDocRef.collection("files").get();
    for (const doc of documentsSnapshot.docs) {
      docMap.set(doc.id, { id: doc.id, ...doc.data() });
    }

    // 2. If signed in, also merge documents from guest_user session so users don't lose their files
    if (userId && userId !== "guest_user") {
      try {
        const guestSnapshot = await adminDb
          .collection("users")
          .doc("guest_user")
          .collection("files")
          .get();
        for (const doc of guestSnapshot.docs) {
          if (!docMap.has(doc.id)) {
            docMap.set(doc.id, { id: doc.id, ...doc.data() });
          }
        }
      } catch (e) {
        // ignore guest fetch error
      }
    }

    // 3. Fallback: also check legacy "guest" collection
    try {
      const legacySnapshot = await adminDb
        .collection("users")
        .doc("guest")
        .collection("files")
        .get();
      for (const doc of legacySnapshot.docs) {
        if (!docMap.has(doc.id)) {
          docMap.set(doc.id, { id: doc.id, ...doc.data() });
        }
      }
    } catch (e) {
      // ignore
    }

    // 4. Fetch chat statistics for all files in parallel for maximum speed
    const docEntries = Array.from(docMap.entries());
    const fileStats = await Promise.all(
      docEntries.map(async ([id, data]) => {
        let chatCount = 0;
        let lastMessage = "";
        try {
          const ownerId = data.ref ? data.ref.split("/")[1] : effectiveUserId;
          const chatSnap = await adminDb
            .collection("users")
            .doc(ownerId)
            .collection("files")
            .doc(id)
            .collection("chat")
            .get();

          chatCount = chatSnap.size;
          if (chatCount > 0) {
            const lastDoc = chatSnap.docs[chatSnap.docs.length - 1]?.data();
            lastMessage = lastDoc?.message || "";
          }
        } catch (err) {
          // fallback
        }

        return {
          id,
          name: data.name || "Untitled Document",
          downloadUrl: data.downloadUrl || `/api/files/${id}`,
          size: data.size || 0,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          chatCount,
          type: "pdf" as const,
          lastMessage,
        };
      })
    );

    historyItems.push(...fileStats);

    // 5. Fetch YouTube chats if any
    try {
      const ytSnap = await adminDb
        .collection("users")
        .doc(effectiveUserId)
        .collection("youtubeChats")
        .get();
      for (const doc of ytSnap.docs) {
        const d = doc.data();
        historyItems.push({
          id: doc.id,
          name: d.title || d.url || "YouTube Chat Session",
          downloadUrl: d.url || "",
          size: 0,
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate() : new Date(),
          chatCount: d.messagesCount || 1,
          type: "youtube",
          lastMessage: d.lastMessage || "",
        });
      }
    } catch (err) {
      // ignore
    }

    // Sort newest first
    historyItems.sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  } catch (error) {
    console.warn("Could not fetch history items:", error);
  }

  const pdfCount = historyItems.filter((i) => i.type === "pdf").length;
  const ytCount = historyItems.filter((i) => i.type === "youtube").length;
  const totalChats = historyItems.reduce((acc, curr) => acc + curr.chatCount, 0);

  return (
    <div className="space-y-6">
      {/* Overview Stat Counters */}
      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
        <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/60 flex items-center gap-1.5 shadow-2xs">
          <FileText className="w-3.5 h-3.5 text-purple-600" />
          <span>{pdfCount} PDF {pdfCount === 1 ? "File" : "Files"}</span>
        </span>

        {ytCount > 0 && (
          <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200/60 flex items-center gap-1.5 shadow-2xs">
            <Youtube className="w-3.5 h-3.5 text-red-500" />
            <span>{ytCount} YouTube {ytCount === 1 ? "Chat" : "Chats"}</span>
          </span>
        )}

        <span className="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-600 border border-gray-200/70 flex items-center gap-1.5 shadow-2xs">
          <MessageSquare className="w-3.5 h-3.5 text-gray-500" />
          <span>{totalChats} Total Messages</span>
        </span>
      </div>

      {/* History Cards Grid */}
      <div className="flex flex-wrap justify-start items-stretch gap-6">
        {historyItems.map((item) => (
          <Document
            key={item.id}
            id={item.id}
            name={item.name}
            size={item.size}
            downloadUrl={item.downloadUrl}
            chatCount={item.chatCount}
            createdAt={item.createdAt}
            type={item.type}
            lastMessage={item.lastMessage}
          />
        ))}

        {/* Add New Document Card */}
        <PlaceholderDocument />
      </div>
    </div>
  );
}

export default Documents;
