"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventary_model_1 = require("../models/inventary.model");
const router = express_1.Router();
router.get('/getAll', async (req, res, next) => {
    try {
        const inventary = await inventary_model_1.Inventary.find().sort({ outDate: -1 }).populate({
            path: "orderId  userId prodactId",
            module: "orders  users prodacts",
        });
        return res.status(200).send({ inventary: inventary });
    }
    catch (err) {
        throw err;
    }
});
router.get('/getByStatus', async (req, res, next) => {
    try {
        const filter = req.query.status;
        const inventary = await inventary_model_1.Inventary.find({ status: filter }).sort({ outDate: -1 }).populate({
            path: "orderId  userId prodactId",
            module: "orders  users prodacts",
        });
        return res.status(200).send({ inventary: inventary });
    }
    catch (err) {
        throw err;
    }
});
exports.default = router;
//# sourceMappingURL=inventary.router.js.map