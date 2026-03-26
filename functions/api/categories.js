import { json, requireAuth } from "../_shared/auth.js";

export async function onRequestGet(context) {
  const rows = await context.env.DB.prepare(
    "SELECT id, title, type, sort_order, created_at FROM categories ORDER BY type, sort_order, id"
  ).all();
  return json({ ok: true, items: rows.results || [] });
}

export async function onRequestPost(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const body = await context.request.json().catch(() => null);
  if (!body) return json({ ok: false, error: "Geçersiz veri" }, 400);

  const title = String(body.title || "").trim();
  const type = String(body.type || "").trim();
  const sortOrder = Number(body.sort_order || 0);

  if (!title || !type) return json({ ok: false, error: "Başlık ve tür zorunlu" }, 400);

  const result = await context.env.DB.prepare(
    "INSERT INTO categories (title, type, sort_order) VALUES (?1, ?2, ?3)"
  ).bind(title, type, sortOrder).run();

  return json({ ok: true, id: result.meta.last_row_id });
}

export async function onRequestPut(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const body = await context.request.json().catch(() => null);
  if (!body) return json({ ok: false, error: "Geçersiz veri" }, 400);

  const id = Number(body.id || 0);
  const title = String(body.title || "").trim();
  const type = String(body.type || "").trim();
  const sortOrder = Number(body.sort_order || 0);

  if (!id || !title || !type) return json({ ok: false, error: "Eksik veri" }, 400);

  await context.env.DB.prepare(
    "UPDATE categories SET title = ?1, type = ?2, sort_order = ?3 WHERE id = ?4"
  ).bind(title, type, sortOrder, id).run();

  return json({ ok: true });
}

export async function onRequestDelete(context) {
  const denied = await requireAuth(context.request, context.env);
  if (denied) return denied;

  const url = new URL(context.request.url);
  const id = Number(url.searchParams.get("id") || 0);
  if (!id) return json({ ok: false, error: "ID gerekli" }, 400);

  await context.env.DB.prepare("DELETE FROM categories WHERE id = ?1").bind(id).run();
  return json({ ok: true });
}
