import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { adminDb } from "@/firebaseAdmin";

export async function GET(
  request: NextRequest,
  { params }: { params: { fileId: string } }
) {
  try {
    const { fileId } = params;

    if (!fileId) {
      return new NextResponse("File ID required", { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Search for file in uploads directory (including user subdirectories)
    let targetPath: string | null = null;

    if (fs.existsSync(uploadsDir)) {
      const searchDir = (dir: string): string | null => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            const found = searchDir(fullPath);
            if (found) return found;
          } else if (entry.name.startsWith(fileId)) {
            return fullPath;
          }
        }
        return null;
      };

      targetPath = searchDir(uploadsDir);
    }

    if (targetPath && fs.existsSync(targetPath)) {
      const fileBuffer = fs.readFileSync(targetPath);
      return new Response(new Uint8Array(fileBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Length": fileBuffer.length.toString(),
          "Accept-Ranges": "bytes",
          "Content-Disposition": 'inline; filename="document.pdf"',
          "Cache-Control": "public, max-age=31536000, immutable",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Fallback: check Firestore for downloadUrl if stored elsewhere
    const querySnapshot = await adminDb
      .collectionGroup("files")
      .where("__name__", "==", fileId)
      .limit(1)
      .get();

    if (!querySnapshot.empty) {
      const data = querySnapshot.docs[0].data();
      if (data?.downloadUrl && data.downloadUrl.startsWith("http")) {
        return NextResponse.redirect(data.downloadUrl);
      }
    }

    return new NextResponse("File not found", { status: 404 });
  } catch (error: any) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
