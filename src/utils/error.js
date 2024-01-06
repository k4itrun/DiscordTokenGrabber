const process = require("process");
const readline = require("readline");
const colors = require("colors");

function a(e, p) {
    console.log('\n\n\n\n\n=== [antiCrash] :: Unhandled Rejection/Catch ==='.toUpperCase().yellow.dim);
    console.log('Reason: ', e.stack ? String(e.stack).gray : String(e).gray);
    console.log('P: ', p.stack ? String(p.stack).gray : String(p).gray);
    console.log('=== Unhandled Rejection/Catch ===\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function b(x, s) {
    console.log('\n\n\n\n\n\n=== [antiCrash] :: Uncaught Exception/Catch ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', x.stack ? String(x.stack).gray : String(x).gray);
    console.log('Origin: ', s.stack ? String(s.stack).gray : String(s).gray);
    console.log('=== Uncaught Exception/Catch ===\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function c(e, y) {
    console.log('\n\n\n\n\n\n===  [antiCrash] :: Uncaught Exception/Catch (MONITOR) ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', e.stack ? String(e.stack).gray : String(e).gray);
    console.log('Origin: ', y.stack ? String(y.stack).gray : String(y).gray);
    console.log('=== Uncaught Exception/Catch (MONITOR) ===\n\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function d(s) {
    console.log('\n\n\n\n\n\n===  [antiCrash] :: Warning Exception/Catch ==='.toUpperCase().yellow.dim);
    console.log('Exception: ', s.stack ? String(s.stack).gray : String(s).gray);
    console.log('=== Warning Exception/Catch ===\n\n\n\n\n\n'.toUpperCase().yellow.dim);
}

function setupError() {
    process.on('unhandledRejection', a);
    process.on("uncaughtException", b);
    process.on('uncaughtExceptionMonitor', c);
    process.on('warning', d);
}

module.exports = {
    error: setupError
};
