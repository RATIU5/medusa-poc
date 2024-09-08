import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import * as jwt from "jsonwebtoken";
import type {
  PostResponsePovertyNavigation,
  PutResponsePovertyNavigation,
} from "../../../../../utils/types";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.requestId;
  const token = generateToken(userId);

  const result = await fetch(
    `${process.env.VITE_POVERTY_URL}/api/v1/items?filter=metadata.type:eq:header-link`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!result.ok) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: null,
    });
  }
  const data = await result.json();

  return res.status(200).json({ data });
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.requestId;
  const token = generateToken(userId);

  const reqBody = req.body as {
    name?: string;
    slug?: string;
    position?: number;
  };

  if (
    reqBody.name === undefined ||
    reqBody.slug === undefined ||
    !reqBody.position === undefined
  ) {
    return res.status(400).json({
      data: "Missing required fields; check documentation",
    });
  }

  if (reqBody.name === "" || reqBody.slug === "") {
    return res.status(400).json({
      data: "Empty values not allowed",
    });
  }

  if (reqBody.position < 0 || !reqBody.slug.startsWith("/")) {
    return res.status(400).json({
      data: "Invalid value not allowed",
    });
  }

  const newBody = {
    title: `${reqBody.name} - ${reqBody.slug}`,
    metadata: {
      position: reqBody.position,
      type: "header-link",
    },
    content: {
      name: reqBody.name,
      slug: reqBody.slug,
    },
  };

  const result = await fetch(`${process.env.VITE_POVERTY_URL}/api/v1/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(newBody),
  });

  if (!result.ok) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: "Failed to add new link",
    });
  }

  if (result.status !== 201) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: "Failed to add new link",
    });
  }

  const data = (await result.json()) as PostResponsePovertyNavigation;

  return res.status(200).json({ data });
};

export const PUT = async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.requestId;
  const token = generateToken(userId);

  const reqBody = req.body as {
    name?: string;
    slug?: string;
    position?: number;
    id?: string;
  };

  if (
    reqBody.name === undefined ||
    reqBody.slug === undefined ||
    !reqBody.position === undefined ||
    reqBody.id === undefined
  ) {
    return res.status(400).json({
      data: "Missing required fields; check documentation",
    });
  }

  if (reqBody.name === "" || reqBody.slug === "" || reqBody.id === "") {
    return res.status(400).json({
      data: "Empty values not allowed",
    });
  }

  if (reqBody.position < 0 || !reqBody.slug.startsWith("/")) {
    return res.status(400).json({
      data: "Invalid value not allowed",
    });
  }

  const result = await fetch(
    `${process.env.VITE_POVERTY_URL}/api/v1/items/${reqBody.id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: `${reqBody.name} - ${reqBody.slug}`,
        metadata: {
          position: reqBody.position,
          type: "header-link",
        },
        content: {
          name: reqBody.name,
          slug: reqBody.slug,
        },
      }),
    }
  );

  if (!result.ok) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: "Failed to update link",
    });
  }

  if (result.status !== 200) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: "Failed to update link",
    });
  }

  const data = (await result.json()) as PutResponsePovertyNavigation;

  return res.status(200).json({ data });
};

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const userId = req.requestId;
  const token = generateToken(userId);

  const reqBody = req.body as {
    id?: string;
  };

  if (reqBody.id === undefined) {
    return res.status(400).json({
      data: "Missing required fields; check documentation",
    });
  }

  if (reqBody.id === "") {
    return res.status(400).json({
      data: "Empty values not allowed",
    });
  }

  const result = await fetch(
    `${process.env.VITE_POVERTY_URL}/api/v1/items/${reqBody.id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!result.ok) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: "Failed to delete link",
    });
  }

  if (result.status !== 200) {
    console.error(result.status, result.statusText, await result.text());
    return res.status(200).json({
      data: "Failed to delete link",
    });
  }

  return res.status(200).json({ data: "success" });
};

function generateToken(userId: string) {
  const payload = {
    userId,
  };
  const options = {
    expiresIn: "96h",
  };
  return jwt.sign(payload, process.env.JWT_SECRET, options);
}
