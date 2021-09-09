"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubExists = exports.emailExists = exports.userExists = void 0;
function userExists(userId, array) {
    return array.some(function (el) {
        return el.userId === userId;
    });
}
exports.userExists = userExists;
function emailExists(email, array) {
    return array.some(function (el) {
        return el.IdEmail === email;
    });
}
exports.emailExists = emailExists;
function SubExists(email, array) {
    return array.some(function (el) {
        return el.IdChannal === email;
    });
}
exports.SubExists = SubExists;
//# sourceMappingURL=search.js.map