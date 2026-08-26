import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate size (under 5MB for PDFs)
    const maxFileSize = 5 * 1024 * 1024;
    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "Resume file size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Validate type (PDF only)
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed for resumes" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary as raw resource (preserves PDF)
    const folder = `buildfolio/resumes/${session.user.id}`;

    const result = await new Promise<{ secure_url: string } | undefined>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "raw",      // required for non-image files like PDFs
          public_id: "resume",       // fixed name so re-uploading replaces the old one
          overwrite: true,
          format: "pdf",
        },
        (error, uploadResult) => {
          if (error) reject(error);
          else resolve(uploadResult);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ secure_url: result?.secure_url });
  } catch (error) {
    console.error("Resume upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload resume" },
      { status: 500 }
    );
  }
}
