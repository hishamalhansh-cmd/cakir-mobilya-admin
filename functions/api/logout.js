import { json } from "../_shared/auth.js";

export async function onRequestPost(context) {
  const cookieName = context.env.AUTH_COOKIE || "cm_admin_session";
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "set-cookie": `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Secure`
    }
  });
}
