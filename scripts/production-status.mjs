import fs from "node:fs";
import path from "node:path";

const projectRoot = process.cwd();
const envFilePath = path.join(projectRoot, ".env.local");

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const content = fs.readFileSync(filePath, "utf8");
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    entries[key] = value;
  }

  return entries;
}

function labelStatus(ok) {
  return ok ? "OK" : "MISSING";
}

function printSection(title) {
  console.log(`\n${title}`);
  console.log("-".repeat(title.length));
}

async function checkUrl(url) {
  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        "user-agent": "smart-calculator-tools-status-check",
      },
    });

    return {
      ok: response.ok,
      status: response.status,
      url,
    };
  } catch (error) {
    return {
      ok: false,
      status: "ERR",
      url,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main() {
  const env = parseEnvFile(envFilePath);
  const siteUrl =
    env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://smartcalculatortools.net";

  const localVars = [
    "NEXT_PUBLIC_SITE_URL",
    "NEXT_PUBLIC_CONTACT_EMAIL",
    "NEXT_PUBLIC_GA_ID",
    "NEXT_PUBLIC_ADSENSE_CLIENT",
    "NEXT_PUBLIC_ADSENSE_SLOT_HOME",
    "NEXT_PUBLIC_ADSENSE_SLOT_CALC",
  ];

  printSection("Local environment");
  for (const key of localVars) {
    const hasValue = Boolean(env[key]);
    console.log(`${key}: ${labelStatus(hasValue)}`);
  }

  const routes = [
    "/",
    "/contact",
    "/privacy",
    "/cookies",
    "/terms",
    "/robots.txt",
    "/sitemap.xml",
    "/ads.txt",
  ];

  printSection("Production routes");
  const results = await Promise.all(
    routes.map((route) =>
      checkUrl(route === "/" ? siteUrl : `${siteUrl}${route}`)
    )
  );

  for (const result of results) {
    const route = result.url.replace(siteUrl, "") || "/";
    const suffix = "error" in result ? ` (${result.error})` : "";
    console.log(`${route}: ${result.status}${suffix}`);
  }

  const adsTxt = results.find((result) => result.url === `${siteUrl}/ads.txt`);
  if (adsTxt?.status === 404) {
    printSection("ads.txt note");
    console.log(
      "ads.txt is returning 404. In this project that usually means NEXT_PUBLIC_ADSENSE_CLIENT is not configured in production yet."
    );
  }

  printSection("Next actions");
  if (!env.NEXT_PUBLIC_CONTACT_EMAIL) {
    console.log(
      "1. Set NEXT_PUBLIC_CONTACT_EMAIL after creating a public support inbox."
    );
  }
  if (!env.NEXT_PUBLIC_GA_ID) {
    console.log(
      "2. Set NEXT_PUBLIC_GA_ID after creating or locating the GA4 web data stream."
    );
  }
  if (!env.NEXT_PUBLIC_ADSENSE_CLIENT) {
    console.log(
      "3. Set NEXT_PUBLIC_ADSENSE_CLIENT after adding the site in AdSense and copying the publisher ID."
    );
  }
  if (!env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || !env.NEXT_PUBLIC_ADSENSE_SLOT_CALC) {
    console.log(
      "4. Set NEXT_PUBLIC_ADSENSE_SLOT_HOME and NEXT_PUBLIC_ADSENSE_SLOT_CALC after creating display ad units in AdSense."
    );
  }
  console.log("5. Redeploy production after any Vercel environment variable change.");
}

await main();
