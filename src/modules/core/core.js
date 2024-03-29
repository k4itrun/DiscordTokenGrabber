let util = require("util"),
    child_process = require("child_process"),
    exec = util.promisify(child_process.exec);

const getDisk = async () => {
    try {
        let s = (await getCommand("wmic logicaldisk get size")).split(" ").filter(item => item.trim() !== "" && item.trim().toLowerCase() !== "size");
        return s.length > 0 ? Math.floor(parseInt(s[0]) / (1024 * 1024 * 1024)).toString() : "1000";
    } catch (e) {
        console.error(e);
        return "1000";
    }
}

const getTotalMemory = async () => {
    try {
        return parseInt(Math.floor(parseInt(await getCommand("wmic computersystem get totalphysicalmemory | more +1")) / (1024 * 1024 * 1024)));
    } catch (e) {
        console.error(e);
        return "4";
    }
}

const getCleanUUID = async () => {
    try {
        let m = (await getCommand("wmic csproduct get uuid")).match(/UUID\s+([A-Fa-f0-9-]+)/);
        return m ? m[1] : "Not found";
    } catch (e) {
        console.error(e);
        return "Not found";
    }
}

const getCommand = async (c) => {
    try {
        return (await exec(c)).stdout.trim();
    } catch (e) {
        console.error(e);
        return "";
    }
}

const getCpuCount = async () => {
    try {
        let c = parseInt(await getCommand("echo %NUMBER_OF_PROCESSORS%"));
        return isNaN(c) ? "4" : c.toString();
    } catch (e) {
        console.error(e);
        return "4";
    }
}

const getInfo = async () => {
    try {
        const [DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION] = await Promise.all([getDisk(), getTotalMemory(), getCleanUUID(), getCpuCount(), getCommand("powershell.exe (Resolve-DnsName -Name myip.opendns.com -Server 208.67.222.220).IPAddress"), getCommand("wmic OS get caption, osarchitecture | more +1"), getCommand("wmic cpu get name | more +1"), getCommand("wmic PATH Win32_VideoController get name | more +1"), getCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault"), getCommand("powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName")]);
        return { DISK, RAM, UID, CPU_COUNT, IP, OS, CPU, GPU, WINDOWS_KEY, WINDOWS_VERSION }
    } catch (e) {
        console.error(e);
        return { DISK: "Not found", RAM: "Not found", UID: "Not found", CPU_COUNT: "Not found", IP: "Not found", OS: "Not found", CPU: "Not found", GPU: "Not found", WINDOWS_KEY: "Not found", WINDOWS_VERSION: "Not found" };
    }
}

module.exports = {
    getInfo,
};
