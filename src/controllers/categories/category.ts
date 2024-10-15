import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all Categories
export const getCategories = async (_req: projectRequest, res: Response | any) => {
  try {
    // Query the database to get a list of all categories with specific fields selected
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        createAt: true,
        updateAt: true,
      },
    });

    // Respond with the list of categories and indicate success
    res.json({
      result: [...categories],
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-categories)",
      error,
      success: false,
    });
  }
};

// Get a single Category by ID
export const getCategory = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    // Query the database to get the category with specific fields selected
    const category = await prisma.category.findUnique({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-category)",
      error,
      success: false,
    });
  }
};

// Add a new Category
export const addCategory = async (req: projectRequest, res: Response | any) => {
  try {
    const { name, description } = req.body;
    const category = await prisma.category.create({
      data: {
        name,
        description,
      },
    });
    res.json({
      result: category,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-category)",
      error,
      success: false,
    });
  }
};

// Add multiple Categories
export const addCategories = async (req: projectRequest, res: Response | any) => {
  try {
    const categories = req.body; // Assuming req.body is an array of categories

    const createdCategories = await prisma.category.createMany({
      data: categories,
    });

    res.json({
      result: createdCategories,
      message: `${createdCategories.count} categories have been successfully added.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-categories)",
      error,
      success: false,
    });
  }
};

// Edit a Category by ID
export const editCategory = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id: Number(id) },
    });

    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    const category = await prisma.category.update({
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
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-category)",
      error,
      success: false,
    });
  }
};

// Edit multiple Categories
export const editCategories = async (req: projectRequest, res: Response | any) => {
  try {
    const categories = req.body; // Assuming req.body is an array of categories with their ids

    const updatedCategoriesPromises = categories.map(async (category: any) => {
      const existingCategory = await prisma.category.findUnique({
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
    });

    const updatedCategories = await Promise.all(updatedCategoriesPromises);

    res.json({
      result: updatedCategories,
      message: `${updatedCategories.length} categories have been successfully updated.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-categories)",
      error,
      success: false,
    });
  }
};

// Delete a Category by ID
export const deleteCategory = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;
    const category = await prisma.category.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      result: category,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-category)",
      error,
      success: false,
    });
  }
};

// Delete multiple Categories
export const deleteCategories = async (req: projectRequest, res: Response | any) => {
  try {
    const { ids } = req.body; // Assuming req.body contains an array of category IDs to delete

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid input format. Expected an array of category IDs.",
        success: false,
      });
    }

    const deletedCategories = await prisma.category.deleteMany({
      where: {
        id: { in: ids.map((id) => parseInt(id)) },
      },
    });

    res.json({
      message: `${deletedCategories.count} categories have been successfully deleted.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-categories)",
      error: (error as Error).message, // Ensure the error message is properly formatted
      success: false,
    });
  }
};