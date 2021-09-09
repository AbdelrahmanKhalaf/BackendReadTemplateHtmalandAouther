"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stripe_1 = require("./stripe");
const config_1 = __importDefault(require("../config/config"));
const express_1 = require("express");
const router = express_1.Router();
router.post('/', async (req, res) => {
    const dominUrl = config_1.default.URL;
    const { line_items, customer_email, prodactId, count, index } = req.body;
    console.log(prodactId);
    if (!line_items && !customer_email)
        return res.status(400).send({ error: "missing required session parmameters" });
    let sessison;
    console.log(count);
    try {
        sessison = await stripe_1.stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `http://localhost:4200/user/my-orders?session_id={CHECKOUT_SESSION_ID}&&prodactId=${prodactId}&&count=${count}&&index=${index}`,
            cancel_url: `http://localhost:4200/user/my-orders/canceld`,
            shipping_address_collection: { allowed_countries: ['GB', 'US', "EG"] }
        });
        console.log(sessison);
        return res.status(200).send({ sessionId: sessison.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "an error occured , unable to create session" });
    }
    return;
});
router.post('/walt', async (req, res) => {
    const dominUrl = config_1.default.URL;
    const { line_items, customer_email, walt } = req.body;
    if (!line_items && !customer_email)
        return res.status(400).send({ error: "missing required session parmameters" });
    let sessison;
    try {
        sessison = await stripe_1.stripeAPI.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            customer_email,
            success_url: `http://localhost:4200/user/walt-add?session_id={CHECKOUT_SESSION_ID}&&walt=${walt}`,
            cancel_url: `http://localhost:4200/user/my-orders/canceld`,
            shipping_address_collection: { allowed_countries: ['GB', 'US', "EG"] }
        });
        return res.status(200).send({ sessionId: sessison.id });
    }
    catch (err) {
        console.log(err);
        res.status(400).send({ error: "an error occured , unable to create session" });
    }
    return;
});
router.get('/my-order/succsess', async (req, res) => {
    const session = await stripe_1.stripeAPI.checkout.sessions.retrieve(req.query.session_id);
    const payment = await stripe_1.stripeAPI.payment.retrieve(session.payment_intent);
    console.log(payment);
    const customer = await stripe_1.stripeAPI.customers.retrieve(session.customer);
    res.send({ user: customer.shipping.name });
    console.log(session);
});
exports.default = router;
//# sourceMappingURL=checkout.router.js.map