"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/categories/Category.ts
const express_1 = require("express");
const category_1 = require("../../controllers/categories/category");
const router = (0, express_1.Router)();
router.get("/get-categories", category_1.getCategories);
router.get("/get-category/:id", category_1.getCategory);
router.post("/add-category", category_1.addCategory);
router.post("/add-categories", category_1.addCategories);
router.put("/edit-category/:id", category_1.editCategory);
router.put("/edit-categories", category_1.editCategories);
router.delete("/delete-category/:id", category_1.deleteCategory);
router.delete("/delete-categories", category_1.deleteCategories);
exports.default = router;
