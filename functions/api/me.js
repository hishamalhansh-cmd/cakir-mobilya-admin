import { json, isAuthorized, getCookieValue } from "../_shared/auth.js";

export async function onRequestGet(context) {
  const { request, env } = context;
  const ok = await isAuthorized(request, env);
  if (!ok) return json({ ok: false, user: null }, 401);

  const cookieName = env.AUTH_COOKIE || "cm_admin_session";
  const raw = getCookieValue(request.headers.get("cookie"), cookieName);
  const username = (raw.split(".")[0] || "").trim();

  return json({ ok: true, user: { username } });
}
