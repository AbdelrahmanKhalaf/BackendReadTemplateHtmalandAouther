"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = void 0;
function addDays(date, days) {
    const copy = new Date(Number(date));
    copy.setDate(date.getDate() + days);
    return copy;
}
exports.addDays = addDays;
//# sourceMappingURL=add.days.js.map