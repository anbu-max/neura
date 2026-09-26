import { adminDb } from "@/firebaseAdmin";
import PlaceholderDocument from "./PlaceholderDocument";
import { auth } from "@clerk/nextjs/server";
import Document from "./Document";

async function Documents() {
  const { userId } = await auth();
  const effectiveUserId = userId || "guest";

  let docs: Array<{ id: string; name: string; downloadUrl: string; size: number }> = [];

  try {
    const documentsSnapshot = await adminDb
      .collection("users")
      .doc(effectiveUserId)
      .collection("files")
      .get();

    docs = documentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      downloadUrl: doc.data().downloadUrl,
      size: doc.data().size,
    }));
  } catch (error) {
    console.warn("Could not fetch documents from Firebase Admin (check service_key.json):", error);
  }

  return (
    <div className="flex flex-wrap p-6 bg-transparent justify-center lg:justify-start rounded-2xl gap-6 max-w-7xl mx-auto">
      {/* Map through the documents */}
      {docs.map((doc) => (
        <Document
          key={doc.id}
          id={doc.id}
          name={doc.name}
          size={doc.size}
          downloadUrl={doc.downloadUrl}
        />
      ))}

      <PlaceholderDocument />
    </div>
  );
}
export default Documents;
