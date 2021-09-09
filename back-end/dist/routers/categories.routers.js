"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_model_1 = require("../models/categories.model");
const router = express_1.Router();
router.post("/add", async (req, res, next) => {
    try {
        const { title_ar, title_en } = req.body;
        const { error } = categories_model_1.validatCategory(req.body);
        if (error)
            return res.status(404).send(error.details[0].message);
        const vildeTitelAr = await categories_model_1.Category.find({ title_ar: title_ar });
        if (vildeTitelAr[0])
            return res.status(400).send({ error: " الفئة موجده بي الفعل ", });
        const vildeTitelEn = await categories_model_1.Category.find({ title_en: title_en });
        if (vildeTitelEn[0])
            return res.status(400).send({ error: "the category laredy exited", });
        let category = new categories_model_1.Category({
            title_ar: title_ar,
            title_en: title_en,
        });
        res.status(200).send({ categories: category });
        return category.save();
    }
    catch (err) {
        throw err;
    }
});
router.get('/get', async (req, res, next) => {
    const categories = await categories_model_1.Category.find();
    return res.status(200).send({ categories: categories });
});
router.get('/get/:id', async (req, res, next) => {
    const categories = await categories_model_1.Category.find({ _id: req.params.id });
    return res.status(200).send({ categories: categories });
});
router.delete('/delete/:id', async (req, res, next) => {
    const id = req.params.id;
    const prodact = await categories_model_1.Category.find({ _id: id });
    if (!prodact[0])
        return res.status(400).send({ error_ar: "هذا الفئة الذي تحاول تحديده غير موجد", error_en: "The catgpery you try selecte it not found" });
    const categories = await categories_model_1.Category.deleteOne({ _id: id });
    if (categories)
        return res.status(200).send({ message_ar: "لقد تم حذف الفئه بنجاح من فضللك حمل الصفحه من جديد", message_en: "The catogery has been successfully deleted, please reload the page" });
    return;
});
router.put('/update/:id', async (req, res, next) => {
    const { title_ar, title_en } = req.body;
    const id = req.params.id;
    const { error } = categories_model_1.validatCategory(req.body);
    if (error)
        return res.status(404).send(error.details[0].message);
    const vildeTitelAr = await categories_model_1.Category.find({ _id: { $ne: id }, title_ar: title_ar });
    if (vildeTitelAr[0])
        return res.status(400).send({ error_ar: " الفئة موجده بي الفعل ", });
    const vildeTitelEn = await categories_model_1.Category.find({ _id: { $ne: id }, title_en: title_en });
    if (vildeTitelEn[0])
        return res.status(400).send({ error_en: "the category laredy exited", });
    const prodact = await categories_model_1.Category.find({ _id: id });
    if (!prodact[0])
        return res.status(400).send({ error_ar: "هذا الفئة الذي تحاول تحديده غير موجد", error_en: "The subCatgpery you try selecte it not found" });
    const categories = await categories_model_1.Category.updateOne({ _id: id }, {
        $set: {
            title_ar: title_ar,
            title_en: title_en,
        }
    });
    if (categories)
        return res.status(200).send({ message_ar: "لقد تم تحديث الفئه بنجاح من فضللك حمل الصفحه من جديد", message_en: "The catogery has been successfully update, please reload the page" });
    return;
});
exports.default = router;
//# sourceMappingURL=categories.routers.js.map