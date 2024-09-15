import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { randomUUID } from "node:crypto";
import { generateToken } from "../../../../utils/token";
import { GetResponseBunnyMediaAll } from "src/utils/types";

type FileData = {
  alt: string;
};

type FormDataPart = {
  filename?: string;
  name?: string;
  contentType?: string;
  data: Buffer;
};

type UploadedItem = {
  title: string;
  content: {
    alt: string;
    src: string;
  };
  metadata: {
    type: string;
  };
};

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const bunnyUrl = `${process.env.BUNNY_API_URL ?? ""}/${
      process.env.BUNNY_API_USERNAME ?? ""
    }/`; // Need the trailing slash to get all items
    const response = await fetch(bunnyUrl, {
      headers: {
        AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
      },
    });

    if (!response.ok) {
      console.error("Failed to fetch media items:", response.statusText);
      throw new Error("Failed to fetch media items");
    }

    if (response.status === 200) {
      const data = (await response.json()) as GetResponseBunnyMediaAll;
      return res.status(200).json({
        data: data.map((m) => ({
          id: m.ObjectName.split(".")[0], // Assumes there are no periods in the name
          path: `${process.env.BUNNY_PUBLIC_URL}/${m.ObjectName}`,
        })),
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch media items" });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const boundary = getBoundary(req.headers["content-type"]);

  if (!boundary) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  const parts = parseMultipartFormData(req.body as Buffer, boundary);
  const fileMap = new Map<string, FileData>();
  const files = new Map<string, Buffer>();

  for (const part of parts) {
    if (part.name?.startsWith("file_")) {
      files.set(part.name, part.data);
    } else if (part.name?.startsWith("alt_")) {
      const fileKey = part.name.replace("alt_", "");
      fileMap.set(fileKey, { alt: part.data.toString() });
    }
  }

  let processedFiles = 0;
  for (const [fileName, fileData] of fileMap) {
    const file = files.get(`file_${fileName}`);

    if (!file) {
      console.log(`File not found: ${fileName}`);
      continue;
    }
    if (file.length === 0) {
      console.log(`File is empty: ${fileName}`);
      continue;
    }

    try {
      const fileType = getImageFileExtension(file);
      if (!fileType) {
        throw new Error(`Unsupported file type for file: ${fileName}`);
      }

      const newFileName = randomUUID();
      const uploadFileUrl = `${process.env.BUNNY_API_URL ?? ""}/${
        process.env.BUNNY_API_USERNAME
      }/${newFileName}.${fileType}`;

      let response = await fetch(uploadFileUrl, {
        method: "PUT",
        headers: {
          AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
          "Content-Type": "application/octet-stream",
        },
        body: file,
      });
      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const userId = req.requestId;
      const token = generateToken(userId);

      const uploadedItem: UploadedItem = {
        title: newFileName,
        content: {
          alt: fileData.alt.trim(),
          src: uploadFileUrl,
        },
        metadata: {
          type: "media",
        },
      };

      console.log(`Creating item for file: ${fileName}`);
      response = await fetch(`${process.env.VITE_POVERTY_URL}/api/v1/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(uploadedItem),
      });

      if (!response.ok) {
        response = await fetch(uploadFileUrl, {
          method: "DELETE",
          headers: {
            AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
          },
        });

        if (!response.ok) {
          console.error(
            `Failed to delete uploaded file: ${response.statusText}`
          );
          throw new Error(
            `Failed to create item: ${response.statusText}; failed to delete uploaded image file`
          );
        }

        throw new Error(`Failed to create item: ${response.statusText}`);
      }

      processedFiles++;
    } catch (error) {
      console.error(`Error processing file ${fileName}:`, error);
    }
  }

  if (fileMap.size !== processedFiles) {
    return res.status(500).json({
      error: "Failed to process all files",
    });
  }

  res.status(200).json({ message: "Files processed" });
};

function getBoundary(contentType: string | undefined): string | null {
  const boundaryMatch = contentType?.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  return boundaryMatch ? boundaryMatch[1] || boundaryMatch[2] : null;
}

function parseMultipartFormData(
  buffer: Buffer,
  boundary: string
): Array<FormDataPart> {
  const parts: FormDataPart[] = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = buffer.indexOf(boundaryBuffer);

  while (start !== -1 && start < buffer.length) {
    const end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
    if (end === -1) break;

    const part = buffer.slice(start + boundaryBuffer.length, end);
    const headerEnd = part.indexOf("\r\n\r\n");

    if (headerEnd === -1) {
      start = end;
      continue;
    }

    const headers = part.slice(0, headerEnd).toString();
    const data = part.slice(headerEnd + 4);

    const contentDispositionMatch = headers.match(
      /Content-Disposition:.*?(?:filename="?(.+?)"?(?:;|$))|(?:name="?(.+?)"?(?:;|$))/i
    );
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);

    parts.push({
      filename: contentDispositionMatch
        ? contentDispositionMatch[1]
        : undefined,
      name: contentDispositionMatch ? contentDispositionMatch[2] : undefined,
      contentType: contentTypeMatch ? contentTypeMatch[1] : undefined,
      data: data,
    });

    start = end;
  }

  return parts;
}

function getImageFileExtension(buffer: Buffer): string | null {
  const signatures: { [key: string]: number[] } = {
    jpeg: [0xff, 0xd8, 0xff],
    png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
    gif: [0x47, 0x49, 0x46, 0x38],
    webp: [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50],
    heic: [
      0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63,
    ],
  };

  for (const [extension, signature] of Object.entries(signatures)) {
    if (buffer.length >= signature.length) {
      const bufferSignature = buffer.slice(0, signature.length);
      if (
        signature.every(
          (byte, index) => byte === bufferSignature[index] || byte === 0
        )
      ) {
        return extension === "jpeg" ? "jpg" : extension;
      }
    }
  }

  const svgSignature = buffer.slice(0, 5).toString().toLowerCase();
  if (svgSignature === "<?xml" || svgSignature.startsWith("<svg")) {
    return "svg";
  }

  return null;
}
