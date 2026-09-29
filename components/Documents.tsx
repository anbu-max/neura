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
    // 1. Parallelize fetching across active user, guest_user, and legacy guest sessions
    const userIdsToQuery = [effectiveUserId];
    if (userId && userId !== "guest_user") {
      userIdsToQuery.push("guest_user");
    }
    userIdsToQuery.push("guest");

    // Execute all file queries concurrently for maximum speed
    const snapshots = await Promise.all(
      userIdsToQuery.map((uid) =>
        adminDb.collection("users").doc(uid).collection("files").get().catch(() => null)
      )
    );

    for (const snap of snapshots) {
      if (snap && snap.docs) {
        for (const doc of snap.docs) {
          if (!docMap.has(doc.id)) {
            docMap.set(doc.id, { id: doc.id, ...doc.data() });
          }
        }
      }
    }

    // 4. Map file statistics and accurately classify YouTube vs PDF documents (deduplicating by ID)
    const itemsMap = new Map<string, HistoryItem>();

    docMap.forEach((data, id) => {
      const isYouTube =
        data.type === "youtube" ||
        id.startsWith("yt_") ||
        Boolean(data.videoId) ||
        Boolean(
          data.downloadUrl &&
            (data.downloadUrl.includes("youtube.com") ||
              data.downloadUrl.includes("youtu.be"))
        );

      itemsMap.set(id, {
        id,
        name: data.name || (isYouTube ? "YouTube Video" : "Untitled Document"),
        downloadUrl: data.downloadUrl || (isYouTube ? "" : `/api/files/${id}`),
        size: isYouTube ? 0 : data.size || 0,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate()
          : data.createdAt
          ? new Date(data.createdAt)
          : new Date(),
        chatCount: data.chatCount || 0,
        type: isYouTube ? ("youtube" as const) : ("pdf" as const),
        lastMessage: data.lastMessage || "",
      });
    });

    // 5. Fetch YouTube chats if any, merging into itemsMap without duplicates
    try {
      const ytSnap = await adminDb
        .collection("users")
        .doc(effectiveUserId)
        .collection("youtubeChats")
        .get();
      for (const doc of ytSnap.docs) {
        const d = doc.data();
        const existing = itemsMap.get(doc.id);
        if (existing) {
          // Keep single card, ensure type is strictly "youtube"
          existing.type = "youtube";
          if (d.title) existing.name = d.title;
          if (d.url) existing.downloadUrl = d.url;
        } else {
          itemsMap.set(doc.id, {
            id: doc.id,
            name: d.title || d.url || "YouTube Video",
            downloadUrl: d.url || "",
            size: 0,
            createdAt: d.createdAt?.toDate
              ? d.createdAt.toDate()
              : d.createdAt
              ? new Date(d.createdAt)
              : new Date(),
            chatCount: d.messagesCount || 0,
            type: "youtube" as const,
            lastMessage: d.lastMessage || "",
          });
        }
      }
    } catch (err) {
      // ignore
    }

    historyItems.push(...Array.from(itemsMap.values()));

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
