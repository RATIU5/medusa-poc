import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const boundary = getBoundary(req.headers["content-type"]);

  const uploadFileUrl = new URL(
    "/povertycms/test.jpg",
    "https://storage.bunnycdn.com"
  );

  if (!boundary) {
    return res.status(400).json({ error: "Invalid content type" });
  }

  console.log("Boundary:", boundary);
  console.log("Body length:", (req.body as Buffer).length);
  const parts = parseMultipartFormData(req.body as Buffer, boundary);
  console.log("Number of parts:", parts.length);

  for (const part of parts) {
    if (part.data.length > 0) {
      try {
        console.log(
          `Uploading file: ${part.filename}, Content-Type: ${part.contentType}, Data length: ${part.data.length}`
        );
        const response = await fetch(uploadFileUrl, {
          method: "PUT",
          headers: {
            AccessKey: "22a690ff-2931-40d1-bdeff64f189a-c626-46d7",
            "Content-Type": "application/octet-stream",
          },
          body: part.data,
        });
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }

        console.log(`File ${part.filename} uploaded successfully`);
      } catch (error) {
        console.log("Error uploading file", error);
        return res.status(500).json({ error: "Error uploading file" });
      }
    }
  }
  res.status(200).json({ message: "Files processed" });
};

function getBoundary(contentType: string): string | null {
  console.log("Parsing Content-Type:", contentType);
  const boundaryMatch = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);
  console.log("Boundary match result:", boundaryMatch);
  return boundaryMatch ? boundaryMatch[1] || boundaryMatch[2] : null;
}

function parseMultipartFormData(buffer: Buffer, boundary: string) {
  const parts: Array<{
    filename?: string;
    contentType?: string;
    data: Buffer;
  }> = [];
  const boundaryBuffer = Buffer.from(`--${boundary}`);
  let start = buffer.indexOf(boundaryBuffer);

  console.log("Start position:", start);

  while (start !== -1 && start < buffer.length) {
    const end = buffer.indexOf(boundaryBuffer, start + boundaryBuffer.length);
    console.log("End position:", end);

    if (end === -1) break;

    const part = buffer.slice(start + boundaryBuffer.length, end);
    const headerEnd = part.indexOf("\r\n\r\n");

    if (headerEnd === -1) {
      console.log("Invalid part structure, skipping...");
      start = end;
      continue;
    }

    const headers = part.slice(0, headerEnd).toString();
    const data = part.slice(headerEnd + 4);

    console.log("Headers:", headers);

    const contentDispositionMatch = headers.match(
      /Content-Disposition:.*?(?:filename="?(.+?)"?(?:;|$))/i
    );
    const contentTypeMatch = headers.match(/Content-Type:\s*([^\r\n]+)/i);

    const filename = contentDispositionMatch
      ? contentDispositionMatch[1]
      : undefined;
    const contentType = contentTypeMatch ? contentTypeMatch[1] : undefined;

    console.log("Extracted filename:", filename);
    console.log("Extracted content type:", contentType);

    parts.push({
      filename: filename,
      contentType: contentType,
      data: data,
    });

    console.log("Part added:", {
      filename: filename,
      contentType: contentType,
      dataLength: data.length,
    });

    start = end;
  }

  return parts;
}
