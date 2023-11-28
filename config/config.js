require("dotenv").config();

module.exports = function getconfig() {
    return {
        "webhook": process.env.WEBHOOK || "",
        "kill":{ 
            "discords": "no",
            "browsers": "no",
        }, 
        "debugger": "yes", 
        "injection": "yes", 
    }
}
