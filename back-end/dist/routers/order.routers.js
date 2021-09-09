"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const prodacts_model_1 = require("../models/prodacts.model");
const user_model_1 = require("../models/user.model");
const orders_models_1 = require("../models/orders.models");
const inventary_model_1 = require("../models/inventary.model");
const router = express_1.Router();
router.post("/add", async (req, res, next) => {
    try {
        const { address_en, address_ar, count, userId, prodactId } = req.body;
        const { error } = orders_models_1.validatOrder(req.body);
        if (error)
            return res.status(404).send(error.details[0].message);
        const prodact = await prodacts_model_1.Prodact.find({ _id: prodactId });
        const inventary = await inventary_model_1.Inventary.find({
            userId: userId,
            prodactId: prodactId,
            status: 1
        });
        if (!prodact[0])
            return res
                .status(200)
                .send({
                message_ar: "هذا المنتج الذي حددته غير موجد ",
                message_en: "The prodact is not exited with us",
            });
        const user = await user_model_1.User.find({ _id: userId });
        if (!user[0])
            return res
                .status(200)
                .send({
                message_ar: "هذا المستخدم الذي حددته غير موجد ",
                message_en: "The user is not exited with us",
            });
        const chackeOrderExited = await orders_models_1.Order.find({
            prodactId: prodactId,
            userId: userId,
            status: 0
        });
        if (!chackeOrderExited[0]) {
            const order = new orders_models_1.Order({
                address_ar: address_ar,
                address_en: address_en,
                count: count,
                price: prodact[0].price * count,
                userId: userId,
                prodactId: prodactId,
                status: 0,
                prodactDetails: {
                    prodactId: prodactId,
                    price: prodact[0].price,
                    sale: prodact[0].sale,
                    title_en: prodact[0].title_en,
                    img: prodact[0].img[0].img
                }
            });
            res.status(200).send({ order: order });
            return order.save();
        }
        if (chackeOrderExited[0]) {
            const Count = Number(chackeOrderExited[0].count) + Number(count);
            const price = chackeOrderExited[0].price + count * prodact[0].price;
            if (Count == 0) {
                await orders_models_1.Order.deleteOne({ userId: userId, prodactId: prodactId });
            }
            if (inventary[0]) {
                const countI = Number(inventary[0].count) + Number(count);
                await inventary_model_1.Inventary.updateOne({ userId: userId, prodactId: prodactId, status: 0 }, {
                    $set: {
                        count: countI,
                        status: 0,
                        orderId: chackeOrderExited[0]._id,
                    },
                });
            }
            if (!inventary[0]) {
                const order = await inventary_model_1.Inventary.find({ _id: chackeOrderExited[0]._id, status: 0 });
                if (order[0])
                    return res.status(400).send("the oreder already exists ");
                const invent = new inventary_model_1.Inventary({
                    orderId: chackeOrderExited[0]._id,
                    count: count,
                    status: 0,
                    userId: userId,
                    prodactId: prodactId,
                    titleProdact: prodact[0].title_en,
                    idToView: prodactId
                });
                invent.save();
            }
            if (Count != 0) {
                await orders_models_1.Order.updateOne({ userId: userId, prodactId: prodactId, status: 0 }, {
                    $set: {
                        count: Count,
                        price: price,
                    },
                });
            }
            const orders = await orders_models_1.Order.find({ userId: userId, prodactId: prodactId, status: 0 });
            return res.status(200).send({ orders: orders, message_en: "done add order to your profile" });
        }
    }
    catch (err) {
        next(err);
    }
});
router.put("/delete", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    try {
        const { count, prodactId } = req.body;
        const userId = res.locals.user._id;
        const prodact = await prodacts_model_1.Prodact.find({ _id: prodactId });
        if (!prodact[0])
            return res
                .status(400)
                .send({
                message_ar: "هذا المنتج الذي حددته غير موجد ",
                message_en: "The prodact is not exited with us",
            });
        const user = await user_model_1.User.find({ _id: userId });
        if (!user[0])
            return res
                .status(400)
                .send({
                message_ar: "هذا المستخدم الذي حددته غير موجد ",
                message_en: "The user is not exited with us",
            });
        const chackeOrderExited = await orders_models_1.Order.find({
            prodactId: prodactId,
            userId: userId,
        });
        if (!chackeOrderExited[0])
            return res.status(404).send("the order with the id is not found");
        if (chackeOrderExited[0].count > 1 &&
            count != chackeOrderExited[0].count) {
            const Count = Number(chackeOrderExited[0].count) - Number(count);
            const price = Number(chackeOrderExited[0].price) - (count * Number(prodact[0].price));
            const inventary = await inventary_model_1.Inventary.find({
                userId: userId,
                prodactId: prodactId,
                status: 0
            });
            await orders_models_1.Order.updateOne({ userId: userId, prodactId: prodactId, status: 0 }, {
                $set: {
                    count: Count,
                    price: price,
                },
            });
            if (inventary[0]) {
                const countI = Number(inventary[0].count) + Number(count);
                await inventary_model_1.Inventary.updateOne({ userId: userId, prodactId: prodactId, status: 0 }, {
                    $set: {
                        count: countI,
                        status: 0,
                        orderId: chackeOrderExited[0]._id,
                    },
                });
            }
            if (!inventary[0]) {
                const order = await inventary_model_1.Inventary.find({ _id: chackeOrderExited[0]._id, status: 0 });
                if (order[0])
                    return res.status(400).send("the oreder already exists ");
                const invent = new inventary_model_1.Inventary({
                    orderId: chackeOrderExited[0]._id,
                    count: count,
                    status: 0,
                    userId: userId,
                    prodactId: prodactId,
                    titleProdact: prodact[0].title_en,
                    idToView: prodactId
                });
                invent.save();
            }
            const orders = await orders_models_1.Order.find({
                userId: userId,
                prodactId: prodactId,
            }).populate({
                path: "userId prodactId",
                module: "users prodacts",
            });
            return res.status(200).send({
                orders: orders, message_ar: "لقد تم الحذف بنجاح ",
                message_en: `The order has been deletes ${count} of count  `,
            });
        }
        if (count >= chackeOrderExited[0].count) {
            const inventary = await inventary_model_1.Inventary.find({
                userId: userId,
                prodactId: prodactId,
                status: 1
            });
            await orders_models_1.Order.deleteOne({ userId: userId, prodactId: prodactId });
            await orders_models_1.Order.find({ userId: userId, prodactId: prodactId });
            if (inventary[0]) {
                const countI2 = inventary[0].count + count;
                await inventary_model_1.Inventary.updateOne({ userId: userId, prodactId: prodactId, status: 0 }, {
                    $set: {
                        count: countI2,
                        status: 0,
                        orderId: chackeOrderExited[0]._id,
                    },
                });
            }
            if (!inventary[0]) {
                const order = await inventary_model_1.Inventary.find({ _id: chackeOrderExited[0]._id, status: 1 });
                if (order[0])
                    return res.status(400).send("the oreder already exists ");
                const invent = new inventary_model_1.Inventary({
                    orderId: chackeOrderExited[0]._id,
                    count: count,
                    status: 0,
                    userId: userId,
                    prodactId: prodactId,
                    titleProdact: chackeOrderExited[0].title_en,
                    idToView: prodactId
                });
                invent.save();
            }
            return res
                .status(200)
                .send({
                message_ar: "لقد تم الحذف بنجاح ",
                message_en: "The order has been deleted",
            });
        }
        return;
    }
    catch (err) {
        throw err;
    }
});
router.put("/Buydone", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    try {
        const { count, prodactId } = req.body;
        const userId = res.locals.user._id;
        const prodact = await prodacts_model_1.Prodact.find({ _id: prodactId });
        if (!prodact[0])
            return res
                .status(400)
                .send({
                message_ar: "هذا المنتج الذي حددته غير موجد ",
                message_en: "The prodact is not exited with us",
            });
        const user = await user_model_1.User.find({ _id: userId });
        if (!user[0])
            return res
                .status(400)
                .send({
                message_ar: "هذا المستخدم الذي حددته غير موجد ",
                message_en: "The user is not exited with us",
            });
        const chackeOrderExited = await orders_models_1.Order.find({
            prodactId: prodactId,
            userId: userId,
            status: 0
        });
        if (!chackeOrderExited[0])
            return res.status(404).send("the order with the id is not found");
        if (chackeOrderExited[0].count > 1 &&
            count != chackeOrderExited[0].count) {
            const Count = Number(chackeOrderExited[0].count) - Number(count);
            const price = Number(chackeOrderExited[0].price) - (count * Number(prodact[0].price));
            const inventary = await inventary_model_1.Inventary.find({
                userId: userId,
                prodactId: prodactId,
                status: 2
            });
            await orders_models_1.Order.updateOne({ userId: userId, prodactId: prodactId, status: 0 }, {
                $set: {
                    count: Count,
                    price: price,
                },
            });
            const statusOfOrderBuy = 2;
            const orderBuy = await orders_models_1.Order.find({ userId: userId, prodactId: prodactId, status: statusOfOrderBuy });
            if (!orderBuy[0] || orderBuy == ([] || undefined)) {
                const order = new orders_models_1.Order({
                    address_ar: chackeOrderExited[0].address_ar,
                    address_en: chackeOrderExited[0].address_en,
                    count: count,
                    price: prodact[0].price * count,
                    userId: userId,
                    prodactId: prodactId,
                    status: 2,
                    prodactDetails: {
                        prodactId: prodactId,
                        price: prodact[0].price,
                        sale: prodact[0].sale,
                        title_en: prodact[0].title_en,
                        img: prodact[0].img[0].img
                    }
                });
                order.save();
            }
            else {
                const countOfOrderBuy = Number(orderBuy[0].count) + Number(count);
                ;
                const priceOfOrderBuy = Number(orderBuy[0].price) + (count * Number(prodact[0].price));
                await orders_models_1.Order.updateOne({ userId: userId, prodactId: prodactId, status: statusOfOrderBuy }, {
                    $set: {
                        count: countOfOrderBuy,
                        price: priceOfOrderBuy,
                        status: 2
                    }
                });
            }
            if (inventary[0]) {
                const countI = Number(inventary[0].count) + Number(count);
                await inventary_model_1.Inventary.updateOne({ userId: userId, prodactId: prodactId, status: 2 }, {
                    $set: {
                        count: countI,
                        status: 2,
                        orderId: chackeOrderExited[0]._id,
                    },
                });
            }
            if (!inventary[0]) {
                const order = await inventary_model_1.Inventary.find({ _id: chackeOrderExited[0]._id, status: 2 });
                if (order[0])
                    return res.status(400).send("the oreder already exists ");
                const invent = new inventary_model_1.Inventary({
                    orderId: chackeOrderExited[0]._id,
                    count: count,
                    status: 2,
                    userId: userId,
                    prodactId: prodactId,
                    titleProdact: prodact[0].title_en,
                    idToView: prodactId
                });
                invent.save();
            }
            const orders = await orders_models_1.Order.find({
                userId: userId,
                prodactId: prodactId,
                status: 2
            });
            const order = await orders_models_1.Order.find({
                userId: userId,
                prodactId: prodactId,
                status: 0
            }).populate({
                path: "userId prodactId",
                module: "users prodacts",
            });
            return res.status(200).send({
                orders: orders[0], order: order, message_ar: "لقد تم الحذف بنجاح ",
                message_en: `The order has been deletes ${count} of count  `,
            });
        }
        if (count >= chackeOrderExited[0].count) {
            const inventary = await inventary_model_1.Inventary.find({
                userId: userId,
                prodactId: prodactId,
                status: 2
            });
            await orders_models_1.Order.deleteOne({ userId: userId, prodactId: prodactId, status: 0 });
            if (inventary[0]) {
                const countI2 = inventary[0].count + count;
                await inventary_model_1.Inventary.updateOne({ userId: userId, prodactId: prodactId, status: 2 }, {
                    $set: {
                        count: countI2,
                        status: 2,
                        orderId: chackeOrderExited[0]._id,
                    },
                });
            }
            if (!inventary[0]) {
                const order = await inventary_model_1.Inventary.find({ _id: chackeOrderExited[0]._id, status: 2 });
                if (order[0])
                    return res.status(400).send("the oreder already exists ");
                const invent = new inventary_model_1.Inventary({
                    orderId: chackeOrderExited[0]._id,
                    count: count,
                    status: 2,
                    userId: userId,
                    prodactId: prodactId,
                    titleProdact: chackeOrderExited[0].title_en,
                    idToView: prodactId
                });
                invent.save();
            }
            const statusOfOrderBuy = 2;
            const orderBuy = await orders_models_1.Order.find({ userId: userId, prodactId: prodactId, status: statusOfOrderBuy });
            if (!orderBuy[0] || orderBuy == ([] || undefined)) {
                const order = new orders_models_1.Order({
                    address_ar: chackeOrderExited[0].address_ar,
                    address_en: chackeOrderExited[0].address_en,
                    count: count,
                    price: prodact[0].price * count,
                    userId: userId,
                    prodactId: prodactId,
                    status: 2,
                    prodactDetails: {
                        prodactId: prodactId,
                        price: prodact[0].price,
                        sale: prodact[0].sale,
                        title_en: prodact[0].title_en,
                        img: prodact[0].img[0].img
                    }
                });
                order.save();
                return res
                    .status(200)
                    .send({
                    message_ar: "لقد تم الحذف بنجاح ",
                    message_en: "The order has been deleted",
                    order: order
                });
            }
            else {
                const countOfOrderBuy = Number(orderBuy[0].count) + Number(count);
                ;
                const priceOfOrderBuy = Number(orderBuy[0].price) + (count * Number(prodact[0].price));
                await orders_models_1.Order.updateOne({ userId: userId, prodactId: prodactId, status: statusOfOrderBuy }, {
                    $set: {
                        count: countOfOrderBuy,
                        price: priceOfOrderBuy,
                        status: 2
                    }
                });
                const orders = await orders_models_1.Order.find({
                    userId: userId,
                    prodactId: prodactId,
                    status: 2
                });
                return res
                    .status(200)
                    .send({
                    message_ar: "لقد تم الحذف بنجاح ",
                    message_en: "The order has been deleted",
                    order: orders[0]
                });
            }
        }
        return;
    }
    catch (err) {
        throw err;
    }
});
router.delete('/deleteAll', [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    try {
        const orders = await orders_models_1.Order.find({ userId: res.locals.user._id });
        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            const inventaries = await inventary_model_1.Inventary.find({ prodactId: order.prodactId, userId: order.userId, status: 0 });
            if (inventaries[0]) {
                const count = Number(inventaries[0].count) + Number(orders[i].count);
                await inventary_model_1.Inventary.updateOne({ prodactId: inventaries[0].prodactId, userId: inventaries[0].userId, status: 0 }, {
                    $set: {
                        count: count,
                        status: 0,
                        orderId: order._id,
                    },
                });
            }
            const prodactTitle = await prodacts_model_1.Prodact.find({ _id: order.prodactId });
            if (!inventaries[0]) {
                const invent = new inventary_model_1.Inventary({
                    orderId: order._id,
                    count: Number(order.count),
                    status: 0,
                    userId: order.userId,
                    prodactId: order.prodactId,
                    titleProdact: prodactTitle[0].title_en,
                    idToView: order.prodactId
                });
                invent.save();
            }
        }
        await orders_models_1.Order.deleteMany({ userId: res.locals.user._id, status: 0 });
        return res
            .status(200)
            .send({
            message_ar: "لقد تم الحذف بنجاح ",
            message_en: "The order has been deleted",
        });
    }
    catch (err) {
        return res.status(400).send(err);
    }
});
router.get("/", async (req, res, next) => {
    const orders = await orders_models_1.Order.find().populate({
        path: "userId prodactId",
        module: "users prodacts",
    });
    res.status(200).send({ orders: orders });
});
router.get("/ordersUser", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    const orders = await orders_models_1.Order.find({ userId: res.locals.user._id }).populate({
        path: "userId prodactId",
        module: "users prodacts",
    });
    res.status(200).send({ orders: orders });
});
router.get("/orderDetails/:id", [auth_1.AuthenticationMiddleware], async (req, res, next) => {
    const orders = await orders_models_1.Order.find({ _id: req.params.id }).populate({
        path: "userId prodactId",
        module: "users prodacts",
    });
    res.status(200).send({ orders: orders });
});
router.post("/buy/:id", async (req, res, next) => {
    const orders = await orders_models_1.Order.updateOne({ userId: res.locals.user._id, prodactId: req.params.id }, {
        status: 1
    });
});
exports.default = router;
//# sourceMappingURL=order.routers.js.map