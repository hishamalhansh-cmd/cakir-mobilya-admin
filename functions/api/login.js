import { json, signSession } from "../_shared/auth.js";

export async function onRequestPost(context) {
  const { request, env } = context;
  const body = await request.json().catch(() => null);
  if (!body) return json({ ok: false, error: "Geçersiz veri" }, 400);

  const username = String(body.username || "").trim();
  const password = String(body.password || "").trim();

  const row = await env.DB.prepare(
    "SELECT id, username, password FROM admins WHERE username = ?1"
  ).bind(username).first();

  if (!row || row.password !== password) {
    return json({ ok: false, error: "Kullanıcı adı veya şifre yanlış" }, 401);
  }

  const cookieName = env.AUTH_COOKIE || "cm_admin_session";
  const sig = await signSession(username, env.AUTH_SECRET || "CHANGE_ME");
  const cookie = `${cookieName}=${encodeURIComponent(username + "." + sig)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure`;

  return new Response(JSON.stringify({ ok: true, username }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": cookie
    }
  });
}
