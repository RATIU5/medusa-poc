import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { generateToken } from "../../../../../utils/token";
import type { GetResponsePovertyMediaItem } from "../../../../../utils/types";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id;
  const token = generateToken(req.requestId);

  try {
    const response = await fetch(
      `${process.env.VITE_POVERTY_URL}/api/v1/items?filter=metadata.type:eq:media&filter=title:eq:${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch media item");
      throw new Error("Failed to fetch media item");
    }

    const json = (await response.json()) as GetResponsePovertyMediaItem["data"];

    if (json.length !== 1) {
      console.log("Media item not found in poverty");
      throw new Error("Failed to fetch media item");
    }

    return res.status(200).json({ data: json[0] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch media item" });
  }
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const id = req.params.id;
  const token = generateToken(req.requestId);

  try {
    let response = await fetch(
      `${process.env.VITE_POVERTY_URL}/api/v1/items?filter=metadata.type:eq:media&filter=title:eq:${id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log("Failed to fetch media item");
      throw new Error("Failed to delete media item");
    }

    const json = (await response.json()) as GetResponsePovertyMediaItem["data"];

    if (json.length !== 1) {
      console.log("Media item not found in poverty");
      throw new Error("Failed to delete media item");
    }

    const mediaItem = json[0];

    response = await fetch(
      `${process.env.BUNNY_API_URL ?? ""}/${
        process.env.BUNNY_API_USERNAME ?? ""
      }/${mediaItem.title}.${mediaItem.content.src.split(".").pop()}`,
      {
        method: "DELETE",
        headers: {
          AccessKey: process.env.BUNNY_ACCESS_KEY ?? "",
        },
      }
    );

    if (!response.ok) {
      console.log(
        `Failed to delete media item from BunnyCDN: ${response.statusText}`
      );
      throw new Error("Failed to delete media item");
    }

    if (response.status !== 200) {
      console.log("Failed to delete media item from BunnyCDN");
      throw new Error("Failed to delete media item");
    }

    response = await fetch(
      `${process.env.VITE_POVERTY_URL}/api/v1/items/${mediaItem.id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      console.log(
        `Failed to delete media item from poverty: ${response.statusText}`
      );
      throw new Error("Failed to delete media item");
    }

    if (response.status !== 200) {
      console.log("Failed to delete media item from poverty");
      throw new Error("Failed to delete media item");
    }

    return res.status(200).json({ id: mediaItem.title });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete media item" });
  }
};
