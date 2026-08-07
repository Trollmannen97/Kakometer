window.KAKOMETER_CONFIG = {
  SUPABASE_URL: "vercel-api",
  SUPABASE_ANON_KEY: "vercel-api"
};

function apiRequest(url, options = {}) {
  return fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  }).then(async (response) => {
    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.error || `API-feil (${response.status})`);
    }

    return payload;
  });
}

function createSelectBuilder() {
  const builder = {
    order() {
      return builder;
    },
    then(resolve, reject) {
      return apiRequest("/api/cakes")
        .then((data) => resolve({ data, error: null }))
        .catch((error) => resolve({ data: null, error }));
    }
  };

  return builder;
}

function createDeleteBuilder() {
  return {
    eq(column, value) {
      if (column !== "id") {
        return Promise.resolve({ data: null, error: new Error("Kun sletting på id støttes.") });
      }

      return apiRequest(`/api/cakes?id=${encodeURIComponent(value)}`, {
        method: "DELETE"
      })
        .then((data) => ({ data, error: null }))
        .catch((error) => ({ data: null, error }));
    }
  };
}

window.supabase = {
  createClient() {
    return {
      from(table) {
        if (table !== "cakes") {
          throw new Error(`Ukjent tabell: ${table}`);
        }

        return {
          select() {
            return createSelectBuilder();
          },
          insert(rows) {
            return apiRequest("/api/cakes", {
              method: "POST",
              body: JSON.stringify({ cakes: rows })
            })
              .then((data) => ({ data, error: null }))
              .catch((error) => ({ data: null, error }));
          },
          delete() {
            return createDeleteBuilder();
          }
        };
      }
    };
  }
};

const storageText = document.querySelector(".mini-text");
if (storageText) {
  storageText.textContent = "Data lagres i Neon Postgres via Vercel API, slik at flere kan bruke samme kakelogg.";
}
