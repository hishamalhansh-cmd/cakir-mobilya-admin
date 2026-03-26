import { json, requireAuth } from "../_shared/auth.js";

export async function onRequestGet(context) {
  const rows = await context.env.DB.prepare(
    `SELECT m.id, m.brand_id, m.category_id, m.title, m.description, m.image_url, m.sort_order, m.created_at,
            b.title as brand_title, c.title as category_title, c.type as category_type
     FROM models m
     LEFT JOIN brands b ON b.id = m.brand_id
     LEFT JOIN categories c ON c.id = m.category_id
     ORDER BY m.sort_order, m.id`
  ).all();
  return json({ ok: true, items: rows.results || [] });
}

export async function onRequestPost(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const body = await context.request.json().catch(() => null);
  if (!body) return json({ ok: false, error: "Geçersiz veri" }, 400);

  const brandId = Number(body.brand_id || 0);
  const categoryId = Number(body.category_id || 0);
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const imageUrl = String(body.image_url || "").trim();
  const sortOrder = Number(body.sort_order || 0);

  if (!title) return json({ ok: false, error: "Model adı zorunlu" }, 400);

  const result = await context.env.DB.prepare(
    "INSERT INTO models (brand_id, category_id, title, description, image_url, sort_order) VALUES (?1, ?2, ?3, ?4, ?5, ?6)"
  ).bind(brandId || null, categoryId || null, title, description, imageUrl, sortOrder).run();

  return json({ ok: true, id: result.meta.last_row_id });
}

export async function onRequestPut(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const body = await context.request.json().catch(() => null);
  if (!body) return json({ ok: false, error: "Geçersiz veri" }, 400);

  const id = Number(body.id || 0);
  const brandId = Number(body.brand_id || 0);
  const categoryId = Number(body.category_id || 0);
  const title = String(body.title || "").trim();
  const description = String(body.description || "").trim();
  const imageUrl = String(body.image_url || "").trim();
  const sortOrder = Number(body.sort_order || 0);

  if (!id || !title) return json({ ok: false, error: "Eksik veri" }, 400);

  await context.env.DB.prepare(
    "UPDATE models SET brand_id = ?1, category_id = ?2, title = ?3, description = ?4, image_url = ?5, sort_order = ?6 WHERE id = ?7"
  ).bind(brandId || null, categoryId || null, title, description, imageUrl, sortOrder, id).run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const url = new URL(context.request.url);
  const id = Number(url.searchParams.get("id") || 0);
  if (!id) return json({ ok: false, error: "ID gerekli" }, 400);

  await context.env.DB.prepare("DELETE FROM models WHERE id = ?1").bind(id).run();
  return json({ ok: true });
}
