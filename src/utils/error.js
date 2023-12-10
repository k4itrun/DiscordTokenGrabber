const readline = require("readline");
const colors = require("colors");
const process = require("process");

function handleUnhandledRejection(reason, p) {
    console.log('\n\n\n\n\n=== [antiCrash] :: Unhandled Rejection/Catch ==='.toUpperCase().yellow.dim);
    console.log('Reason: ', reason.stack ? String(reason.stack).gray : String(reason).gray);
    console.log('P: ', p.stack ? String(p.stack).gray : String(p).gray);
    console.log('=== Unhandled Rejection/Catch ===\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function handleUncaughtException(err, origin) {
    console.log('\n\n\n\n\n\n=== [antiCrash] :: Uncaught Exception/Catch ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', err.stack ? String(err.stack).gray : String(err).gray);
    console.log('Origin: ', origin.stack ? String(origin.stack).gray : String(origin).gray);
    console.log('=== Uncaught Exception/Catch ===\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function handleUncaughtExceptionMonitor(err, origin) {
    console.log('\n\n\n\n\n\n===  [antiCrash] :: Uncaught Exception/Catch (MONITOR) ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', err.stack ? String(err.stack).gray : String(err).gray);
    console.log('Origin: ', origin.stack ? String(origin.stack).gray : String(origin).gray);
    console.log('=== Uncaught Exception/Catch (MONITOR) ===\n\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function handleWarningException(err) {
    console.log('\n\n\n\n\n\n===  [antiCrash] :: Warning Exception/Catch ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', err.stack ? String(err.stack).gray : String(err).gray);
    console.log('=== Warning Exception/Catch ===\n\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function setupErrorHandlers() {
    process.on('unhandledRejection', handleUnhandledRejection);
    process.on("uncaughtException", handleUncaughtException);
    process.on('uncaughtExceptionMonitor', handleUncaughtExceptionMonitor);
    process.on('warning', handleWarningException);
}

function waitForExit() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Press Enter to exit...", () => {
        rl.close();
        process.exit(0);
    });
}

function initialize() {
    setupErrorHandlers();
    waitForExit();
}

module.exports = {
    error: initialize
};
