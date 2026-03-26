function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}

function getCookieValue(cookieHeader, name) {
  if (!cookieHeader) return "";
  const parts = cookieHeader.split(";").map(v => v.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return decodeURIComponent(part.slice(name.length + 1));
  }
  return "";
}

async function sha256Hex(input) {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
}

async function signSession(username, secret) {
  return await sha256Hex(username + "|" + secret);
}

async function isAuthorized(request, env) {
  const cookieName = env.AUTH_COOKIE || "cm_admin_session";
  const raw = getCookieValue(request.headers.get("cookie"), cookieName);
  if (!raw) return false;
  const [username, sig] = raw.split(".");
  if (!username || !sig) return false;
  const expected = await signSession(username, env.AUTH_SECRET || "CHANGE_ME");
  return sig === expected;
}

async function requireAuth(request, env) {
  const ok = await isAuthorized(request, env);
  if (!ok) return json({ ok: false, error: "Yetkisiz erişim" }, 401);
  return null;
}

export { json, getCookieValue, sha256Hex, signSession, isAuthorized, requireAuth };
