import ResizableDocumentSplit from "@/components/ResizableDocumentSplit";
import { adminDb } from "@/firebaseAdmin";
import { auth } from "@clerk/nextjs/server";

async function ChatToFilePage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest_user";

  let url = `/api/files/${id}`;

  try {
    const ref = await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("files")
      .doc(id)
      .get();

    if (ref.exists && ref.data()?.downloadUrl) {
      url = ref.data()?.downloadUrl;
    } else {
      // Check guest_user in case user uploaded before signing in
      const guestRef = await adminDb
        .collection("users")
        .doc("guest_user")
        .collection("files")
        .doc(id)
        .get();
      if (guestRef.exists && guestRef.data()?.downloadUrl) {
        url = guestRef.data()?.downloadUrl;
      }
    }
  } catch (err) {
    console.warn("Could not query Firestore for file downloadUrl:", err);
  }

  return <ResizableDocumentSplit id={id} url={url} />;
}
export default ChatToFilePage;
