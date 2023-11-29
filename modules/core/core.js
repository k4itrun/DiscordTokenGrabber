const axios = require("axios");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

async function getDisk() {
    try {
        const size = (await getCommand("wmic logicaldisk get size")).split(" ");
        for (let item of size) {
            if (item.trim() !== "" && item.trim().toLowerCase() !== "size") {
                return Math.floor(parseInt(item) / (1024 * 1024 * 1024)).toString();
            }
        }
        return "1000";
    } catch (err) {
        console.error(err);
        return "1000";
    }
}

async function getTotalMemory() {
    try {
        const tpm = await getCommand(
            "wmic computersystem get totalphysicalmemory | more +1"
        );
        return parseInt(Math.floor(parseInt(tpm) / (1024 * 1024 * 1024)));
    } catch (err) {
        console.error(err);
        return 4;
    }
}

async function getCleanUUID() {
    try {
        const uid = await getCommand("wmic csproduct get uuid");
        const regexUid = /UUID\s+([A-Fa-f0-9-]+)/;
        const match = uid.match(regexUid);
        return match ? match[1] : "Not found";
    } catch (err) {
        console.error(err);
        return "Not found";
    }
}

async function getCommand(cmd) {
    try {
        const { stdout } = await exec(cmd);
        return stdout.trim();
    } catch (err) {
        console.error(err);
        return "";
    }
}

async function getCpuCount() {
    try {
        const { stdout } = await getCommand("echo %NUMBER_OF_PROCESSORS%");
        const cpuCount = parseInt(stdout);
        return isNaN(cpuCount) ? "4" : cpuCount.toString();
    } catch (err) {
        console.error(err);
        return "4";
    }
}

async function getInfo() {
    try {
        const [ disk, ram, uid, cpucount, os, cpu, gpu, windowskey, windowsversion ] = await Promise.all([
            getDisk(),
            getTotalMemory(),
            getCleanUUID(),
            getCpuCount(),
            getCommand("wmic OS get caption, osarchitecture | more +1"),
            getCommand("wmic cpu get name | more +1"),
            getCommand("wmic PATH Win32_VideoController get name | more +1"),
            getCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault"),
            getCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName"),
        ]);
        return { disk, ram, uid, cpucount, os, cpu, gpu, windowskey, windowsversion };
    } catch (err) {
        console.error(err);
        return {
            disk: "Not found",
            ram: "Not found",
            uid: "Not found",
            cpucount: "Not found",
            os: "Not found",
            cpu: "Not found",
            gpu: "Not found",
            windowskey: "Not found",
            windowsversion: "Not found",
        };
    }
}

async function getPublicIp() {
    try {
        const __ = await axios({
            url: "https://ipinfo.io/json",
            method: "GET",
        });
        const _ = __.data;
        return _.length > 16 ? "Not found" : _;
    } catch (err) {
        return "Not found";
    }
}

module.exports = {
    getPublicIp,
    getInfo,
};
