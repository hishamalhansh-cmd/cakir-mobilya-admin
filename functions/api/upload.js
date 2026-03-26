import { json, requireAuth } from "../_shared/auth.js";

export async function onRequestPost(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const form = await context.request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return json({ ok: false, error: "Dosya bulunamadı" }, 400);

  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const safeName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const key = `models/${safeName}`;

  await context.env.IMAGES.put(key, await file.arrayBuffer(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream"
    }
  });

  const publicBase = (new URL(context.request.url)).origin;
  const imageUrl = `${publicBase}/api/image/${key}`;

  return json({ ok: true, key, image_url: imageUrl });
}
