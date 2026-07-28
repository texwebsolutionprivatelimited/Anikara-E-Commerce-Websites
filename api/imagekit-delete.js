export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { fileUrl } = req.body;
  if (!fileUrl) {
    res.status(400).send("fileUrl is required");
    return;
  }

  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    res.status(500).send("IMAGEKIT_PRIVATE_KEY is not configured on the server.");
    return;
  }

  try {
    const urlObj = new URL(fileUrl);
    let path = urlObj.pathname;
    
    // Clean path if it includes the public key or endpoint prefix
    const parts = path.split("/").filter(Boolean);
    // If the path is of form: /endpoint_id/categories/image.png
    if (parts.length > 1 && (parts[0] === "feu3swboqb" || parts[0] === urlObj.hostname.split(".")[0])) {
      path = "/" + parts.slice(1).join("/");
    } else {
      path = "/" + parts.join("/");
    }

    const authHeader = "Basic " + Buffer.from(privateKey + ":").toString("base64");

    // Search for file by path to get its fileId
    const listRes = await fetch(`https://api.imagekit.io/v1/files?path=${path}`, {
      headers: { Authorization: authHeader }
    });

    if (!listRes.ok) {
      const text = await listRes.text();
      throw new Error(`Failed to list file from ImageKit: ${text}`);
    }

    const filesList = await listRes.json();
    if (filesList.length === 0) {
      res.status(404).send("File not found on ImageKit");
      return;
    }

    const fileId = filesList[0].fileId;

    // Delete the file using the fileId
    const deleteRes = await fetch(`https://api.imagekit.io/v1/files/${fileId}`, {
      method: "DELETE",
      headers: { Authorization: authHeader }
    });

    if (!deleteRes.ok) {
      const text = await deleteRes.text();
      throw new Error(`Failed to delete file from ImageKit: ${text}`);
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("ImageKit delete error:", err);
    res.status(500).send(err.message || "Internal Server Error");
  }
}
