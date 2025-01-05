"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordUtils = void 0;
const bcrypt = require("bcrypt");
class PasswordUtils {
    constructor() {
        this.saltRound = 10;
    }
    async hashPassword(passowrd) {
        const hashedPassword = await bcrypt.hash(passowrd, this.saltRound);
        return hashedPassword;
    }
    async comparePassword(password, hash) {
        return bcrypt.compare(password, hash);
    }
}
exports.PasswordUtils = PasswordUtils;
//# sourceMappingURL=password-utils.js.map