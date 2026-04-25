const baseUrl = process.env.BASE_URL || "http://localhost:3000";

const routes = [
  "/en",
  "/ar",
  "/en/tours/tbilisi-day-tour",
  "/en/tours/batumi-tour",
  "/en/tours/kazbegi-tour",
  "/en/tours/gudauri-tour",
  "/en/tours/svaneti-tour",
  "/en/tours/kakheti-tour",
  "/ar/tours/tbilisi-day-tour",
  "/ar/tours/batumi-tour",
  "/ar/tours/kazbegi-tour",
  "/ar/tours/gudauri-tour",
  "/ar/tours/svaneti-tour",
  "/ar/tours/kakheti-tour",
  "/en/fleet",
  "/ar/fleet",
  "/en/fleet/minivan-vip",
  "/ar/fleet/minivan-vip",
  "/en/privacy",
  "/ar/privacy",
  "/en/terms",
  "/ar/refund"
];

function hasHeading(html, level) {
  const re = new RegExp(`<${level}[^>]*>\\s*[^<]+\\s*</${level}>`, "i");
  return re.test(html);
}

async function checkRoute(route) {
  const url = `${baseUrl}${route}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "curl/8.6.0"
    },
    redirect: "follow"
  });

  if (!response.ok) {
    return { route, ok: false, reason: `HTTP ${response.status}` };
  }

  const html = await response.text();
  const h1 = hasHeading(html, "h1");
  const h2 = hasHeading(html, "h2");

  if (!h1 || !h2) {
    return { route, ok: false, reason: `Missing heading(s): h1=${h1} h2=${h2}` };
  }

  return { route, ok: true };
}

async function run() {
  const results = await Promise.all(routes.map((route) => checkRoute(route)));
  const failed = results.filter((item) => !item.ok);

  results.forEach((item) => {
    if (item.ok) {
      console.log(`PASS ${item.route}`);
      return;
    }

    console.error(`FAIL ${item.route} - ${item.reason}`);
  });

  if (failed.length > 0) {
    process.exitCode = 1;
  }
}

run().catch((error) => {
  console.error("FAIL verification script error", error);
  process.exit(1);
});
