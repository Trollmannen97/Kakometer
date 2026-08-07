import { neon } from "@neondatabase/serverless";

function getSql() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL mangler. Koble til Neon i Vercel og legg til miljøvariabelen.");
  }

  return neon(process.env.DATABASE_URL);
}

function send(res, status, payload) {
  res.status(status).json(payload);
}

export default async function handler(req, res) {
  try {
    const sql = getSql();

    if (req.method === "GET") {
      const cakes = await sql`
        select id, date, reason, type, amount, created_at
        from cakes
        order by date desc, created_at desc
      `;

      return send(res, 200, cakes);
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const cakes = Array.isArray(body) ? body : body?.cakes;

      if (!Array.isArray(cakes) || cakes.length === 0) {
        return send(res, 400, { error: "Ingen kaker å registrere." });
      }

      const cleaned = cakes.map((cake) => ({
        id: String(cake.id || "").trim(),
        date: String(cake.date || "").trim(),
        reason: String(cake.reason || "").trim(),
        type: String(cake.type || "").trim(),
        amount: Math.max(1, Number(cake.amount) || 1)
      }));

      if (cleaned.some((cake) => !cake.id || !cake.date || !cake.reason || !cake.type)) {
        return send(res, 400, { error: "Alle kaker må ha id, dato, årsak og type." });
      }

      for (const cake of cleaned) {
        await sql`
          insert into cakes (id, date, reason, type, amount)
          values (${cake.id}, ${cake.date}, ${cake.reason}, ${cake.type}, ${cake.amount})
        `;
      }

      return send(res, 201, { ok: true, count: cleaned.length });
    }

    if (req.method === "DELETE") {
      const id = String(req.query?.id || "").trim();

      if (!id) {
        return send(res, 400, { error: "Mangler id på kaken som skal slettes." });
      }

      const deleted = await sql`
        delete from cakes
        where id = ${id}
        returning id
      `;

      if (deleted.length === 0) {
        return send(res, 404, { error: "Fant ikke kaken." });
      }

      return send(res, 200, { ok: true, id });
    }

    res.setHeader("Allow", "GET, POST, DELETE");
    return send(res, 405, { error: "Metoden støttes ikke." });
  } catch (error) {
    console.error("Kakometer API error:", error);
    return send(res, 500, { error: "Databasefeil. Sjekk Vercel-loggene og DATABASE_URL." });
  }
}
