import { createHmac, randomUUID } from "crypto";

export default function handler(_req, res) {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;

  if (!privateKey) {
    res.status(500).send("IMAGEKIT_PRIVATE_KEY is not configured on the server.");
    return;
  }

  const token = randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 1200;
  const signature = createHmac("sha1", privateKey)
    .update(token + expire)
    .digest("hex");

  res.status(200).json({ signature, token, expire });
}
