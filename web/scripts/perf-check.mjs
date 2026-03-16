import { spawn } from "child_process";
import { performance } from "perf_hooks";
import { setTimeout as delay } from "timers/promises";
import { fileURLToPath } from "url";
import path from "path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const npmCmd = "npm";
const isWindows = process.platform === "win32";

function run(cmd, args, options = {}) {
  return new Promise((resolve, reject) => {
    const command = isWindows ? "cmd.exe" : cmd;
    const commandArgs = isWindows ? ["/c", cmd, ...args] : args;
    const child = spawn(command, commandArgs, {
      cwd: root,
      stdio: "inherit",
      shell: false,
      ...options,
    });
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
    });
    child.on("error", reject);
  });
}

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) return true;
    } catch {
      // ignore and retry
    }
    await delay(500);
  }
  return false;
}

async function measureOnce(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const start = performance.now();
  const res = await fetch(url, { cache: "no-store", signal: controller.signal });
  await res.arrayBuffer();
  clearTimeout(timeout);
  return performance.now() - start;
}

async function measureUrl(url, runs = 3) {
  const times = [];
  for (let i = 0; i < runs; i += 1) {
    times.push(await measureOnce(url));
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const max = Math.max(...times);
  return { url, avgMs: Math.round(avg * 100) / 100, maxMs: Math.round(max * 100) / 100 };
}

async function main() {
  console.log("Building production bundle...");
  await run(npmCmd, ["run", "build"]);

  console.log("Starting production server...");
  const serverCommand = isWindows ? "cmd.exe" : npmCmd;
  const serverArgs = isWindows ? ["/c", npmCmd, "run", "start"] : ["run", "start"];
  const server = spawn(serverCommand, serverArgs, {
    cwd: root,
    stdio: "ignore",
    shell: false,
  });

  const shutdown = () => {
    if (!server.killed) {
      server.kill();
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
  process.on("exit", shutdown);

  const ready = await waitForServer("http://localhost:3000/");
  if (!ready) {
    shutdown();
    throw new Error("Server did not become ready in time.");
  }

  const targets = [
    "http://localhost:3000/",
    "http://localhost:3000/calc/bmi",
    "http://localhost:3000/category/financial",
  ];

  const results = [];
  for (const url of targets) {
    results.push(await measureUrl(url, 3));
  }

  console.table(results);
  results.forEach((row) => {
    console.log(`${row.url} avg=${row.avgMs}ms max=${row.maxMs}ms`);
  });
  shutdown();
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
