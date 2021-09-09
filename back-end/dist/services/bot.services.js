"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const instagram_private_api_1 = require("instagram-private-api");
class BotService {
    constructor() {
        this.user = 'abdo_khalaf_official';
        this.password = '01123689625';
    }
    async login() {
        const ig = new instagram_private_api_1.IgApiClient();
        ig.state.generateDevice(this.user);
        await ig.simulate.preLoginFlow();
        const loggedAccoubt = await ig.account.login(this.user, this.password);
        await ig.simulate.postLoginFlow();
        console.log(loggedAccoubt.full_name);
    }
}
exports.default = BotService;
//# sourceMappingURL=bot.services.js.map