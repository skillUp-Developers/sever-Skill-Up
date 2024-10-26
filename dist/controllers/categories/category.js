"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategories = exports.deleteCategory = exports.editCategories = exports.editCategory = exports.addCategories = exports.addCategory = exports.getCategory = exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Get all Categories
const getCategories = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Query the database to get a list of all categories with specific fields selected
        const categories = yield prisma.category.findMany({
            include: {
                project: true,
            },
        });
        // Respond with the list of categories and indicate success
        res.json({
            result: [...categories],
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/get-categories)',
            error,
            success: false,
        });
    }
});
exports.getCategories = getCategories;
// Get a single Category by ID
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Query the database to get the category with specific fields selected
        const category = yield prisma.category.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                name: true,
                description: true,
                createAt: true,
                updateAt: true,
            },
        });
        if (!category) {
            return res.status(404).json({
                message: `Category with ID ${id} not found.`,
                success: false,
            });
        }
        // Respond with the category and indicate success
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/get-category)',
            error,
            success: false,
        });
    }
});
exports.getCategory = getCategory;
// Add a new Category
const addCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const category = yield prisma.category.create({
            data: {
                name,
                description,
            },
        });
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'server error',
            error,
            success: false,
        });
    }
});
exports.addCategory = addCategory;
// Add multiple Categories
const addCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = req.body; // Assuming req.body is an array of categories
        const createdCategories = yield prisma.category.createMany({
            data: categories,
        });
        res.json({
            result: createdCategories,
            message: `${createdCategories.count} categories have been successfully added.`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/add-categories)',
            error,
            success: false,
        });
    }
});
exports.addCategories = addCategories;
// Edit a Category by ID
const editCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const existingCategory = yield prisma.category.findUnique({
            where: { id: Number(id) },
        });
        if (!existingCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const category = yield prisma.category.update({
            where: { id: parseInt(id) },
            data: {
                name,
                description,
            },
        });
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/edit-category)',
            error,
            success: false,
        });
    }
});
exports.editCategory = editCategory;
// Edit multiple Categories
const editCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = req.body; // Assuming req.body is an array of categories with their ids
        const updatedCategoriesPromises = categories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            const existingCategory = yield prisma.category.findUnique({
                where: { id: parseInt(category.id) },
            });
            if (!existingCategory) {
                throw new Error(`Category with id ${category.id} not found`);
            }
            return prisma.category.update({
                where: { id: parseInt(category.id) },
                data: {
                    name: category.name,
                    description: category.description,
                },
            });
        }));
        const updatedCategories = yield Promise.all(updatedCategoriesPromises);
        res.json({
            result: updatedCategories,
            message: `${updatedCategories.length} categories have been successfully updated.`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/edit-categories)',
            error,
            success: false,
        });
    }
});
exports.editCategories = editCategories;
// Delete a Category by ID
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const category = yield prisma.category.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: category,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/delete-category)',
            error,
            success: false,
        });
    }
});
exports.deleteCategory = deleteCategory;
// Delete multiple Categories
const deleteCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body; // Assuming req.body contains an array of category IDs to delete
        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                message: 'Invalid input format. Expected an array of category IDs.',
                success: false,
            });
        }
        const deletedCategories = yield prisma.category.deleteMany({
            where: {
                id: { in: ids.map((id) => parseInt(id)) },
            },
        });
        res.json({
            message: `${deletedCategories.count} categories have been successfully deleted.`,
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'Error happened at calling endpoint (/delete-categories)',
            error: error.message, // Ensure the error message is properly formatted
            success: false,
        });
    }
});
exports.deleteCategories = deleteCategories;
