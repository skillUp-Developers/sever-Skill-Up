// src/routes/categories/Category.ts
import { Router } from "express";
import {
  getCategories,
  getCategory,
  addCategory,
  addCategories,
  editCategory,
  editCategories,
  deleteCategory,
  deleteCategories,
} from "../../controllers/categories/category";

const router = Router();

router.get("/get-categories", getCategories);
router.get("/get-category/:id", getCategory);
router.post("/add-category", addCategory);
router.post("/add-categories", addCategories);
router.put("/edit-category/:id", editCategory);
router.put("/edit-categories", editCategories);
router.delete("/delete-category/:id", deleteCategory);
router.delete("/delete-categories", deleteCategories);

export default router;