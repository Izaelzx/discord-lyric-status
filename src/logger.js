const Logger = {
    info(message) {
        console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
    },
    success(message) {
        console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`);
    },
    warn(message) {
        console.log(`\x1b[33m[WARN]\x1b[0m ${message}`);
    },
    error(message) {
        console.log(`\x1b[31m[ERROR]\x1b[0m ${message}`);
    }
};

module.exports = Logger;