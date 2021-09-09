"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = require("./stripe");
const config_1 = __importDefault(require("../config/config"));
exports.default = async (req, res) => {
    const dominUrl = config_1.default.URL;
    const { line_items, customer_email } = req.body;
    if (!line_items && !customer_email)
        return res.status(400).send({ error: "missing required session parmameters" });
    let sessison;
    try {
        sessison = await stripe_1.stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `${dominUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${dominUrl}/canceled`,
            shipping_address_collection: { allowed_countries: ['GB', 'US', "EG"] }
        });
        return res.status(200).send({ sessionID: sessison.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "an error occured , unable to create session" });
    }
    return;
};
//# sourceMappingURL=checkout.js.map