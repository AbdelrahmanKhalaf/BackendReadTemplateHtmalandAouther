"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_model_1 = require("../models/history.model");
const router = express_1.Router();
router.get('/getAll', async (req, res, next) => {
    try {
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        const lastIndex = page * limit - 1;
        const fristIndex = lastIndex - (limit - 1);
        const length = await history_model_1.History.find({}, { _id: true });
        const history = await history_model_1.History.find().skip(fristIndex).limit(limit).sort({ outDate: -1 }).populate({
            path: "userId",
            module: "users",
        });
        return res.status(200).send({ history: history, length: length.length });
    }
    catch (err) {
        throw err;
    }
});
router.get('/getByStatus', async (req, res, next) => {
    try {
        const filter = req.query.status;
        let page = Number(req.query.page);
        let limit = Number(req.query.limit);
        const lastIndex = page * limit - 1;
        const fristIndex = lastIndex - (limit - 1);
        const length = await history_model_1.History.find({ status: filter }, { _id: true });
        const history = await history_model_1.History.find({ status: filter }).skip(fristIndex).limit(limit).sort({ outDate: -1 }).populate({
            path: "userId",
            module: "users",
        });
        return res.status(200).send({ history: history, length: length.length });
    }
    catch (err) {
        throw err;
    }
});
router.get('/:id', async (req, res, next) => {
    try {
        const filter = req.query.status;
        const history = await history_model_1.History.find({ _id: req.params.id });
        return res.status(200).send({ history: history });
    }
    catch (err) {
        throw err;
    }
});
router.delete('/delete/:id', async (req, res, next) => {
    try {
        await history_model_1.History.deleteOne({ _id: req.params.id });
        return res.status(200).send({ message: 'the history has been delete' });
    }
    catch (err) {
        throw err;
    }
});
exports.default = router;
//# sourceMappingURL=history.router.js.map