import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";

import { uploadToR2 } from "../../lib/uploadToR2"; // Ensure this function is implemented correctly
import multer from "multer";
import { getCategories } from "../categories/category";

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage }); // Multer middleware
export const getProjects = async (req: projectRequest, res: Response | any) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        category: {
          select: {
            id: true, // Selects 'id' from the category
            name: true, // Selects 'name' from the category
            description: true, // Selects 'description' from the category
          },
        },
      },
    });

    // Query the database to get a list of all categories with specific fields selected
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        description: true,
      },
    });

    res.json({
      result: projects,
      categories,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/get-projects)",
      error: error,
      success: false,
    });
  }
};

export const getProject = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
    });

    // If the project doesn't exist, return a 404 response
    if (!project) {
      return res.status(404).json({
        message: `Project with ID ${id} not found.`,
        success: false,
      });
    }

    res.json({
      result: { ...project },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/get-projects)",
      error: error,
      success: false,
    });
  }
};

export const addProject = async (req: projectRequest, res: Response | any) => {
  try {
    const { name, description, categoryId, client, link } = req.body;

    const file: Express.Multer.File | undefined = req.file;

    // Upload the file if present
    const imageUrl = file ? await uploadToR2(file) : "";

    const project = await prisma.project.create({
      data: {
        name,
        description,
        imageUrl,
        categoryId: parseInt(categoryId),
        client,
        link,
      },
    });
    res.json({
      result: { ...project },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/add-project)",
      error: error,

      success: false,
    });
  }
};

export const addProjects = async (req: projectRequest, res: Response | any) => {
  try {
    // Assuming req.body is an array of projects
    const projects = req.body; // Example: [{ name: 'Project 1', description: 'Description 1' }, ...]

    // Prepare an array to hold all the project creation promises
    const projectPromises = projects.map(async (project: any) => {
      const file: Express.Multer.File | undefined = project.file;

      // Upload the file if present for each project
      const imageUrl = file ? await uploadToR2(file) : "";

      // Create the project using prisma.create
      return prisma.project.create({
        data: {
          name: project.name,
          description: project.description,
          imageUrl,
          categoryId: project.categoryId,
          client: project.client,
        },
      });
    });

    // Wait for all projects to be created
    const createdProjects = await Promise.all(projectPromises);

    res.json({
      result: createdProjects,
      message: `${createdProjects.length} projects have been successfully added.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/add-projects)",
      error: error,
      success: false,
    });
  }
};

export const editProject = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;
    const file = req.file;

    // Finding the existing project to check if it exists
    const existingProject = await prisma.project.findUnique({
      where: { id: Number(id) },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Handle image upload, only if a file is provided
    const imageUrl = file ? await uploadToR2(file) : existingProject.imageUrl;

    // Update only the fields that need to be updated
    const updatedData = {
      name: req.body.name || existingProject.name,
      description: req.body.description || existingProject.description,
      imageUrl: imageUrl,
      link: req.body.link || existingProject.link,
      categoryId: req.body.categoryId
        ? Number(req.body.categoryId)
        : existingProject.categoryId,
      client: req.body.client || existingProject.client,
    };

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: updatedData,
      select: {
        id: true,
        name: true,
        description: true,
        imageUrl: true,
        link: true,
        categoryId: true,
        client: true,
        createAt: true,
        updateAt: true,
      },
    });

    res.json({
      result: project,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-project)",
      error: error,
      success: false,
    });
  }
};

export const editProjects = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    // Assuming req.body contains an array of projects with their ids
    const projects = req.body; // Example: [{ id: 1, name: 'New Name', description: 'New Description', imageUrl: '...' }, ...]

    const updatedProjectsPromises = projects.map(async (project: any) => {
      // Find the existing project by id
      const existingProject = await prisma.project.findUnique({
        where: { id: parseInt(project.id) },
      });

      if (!existingProject) {
        throw new Error(`Project with id ${project.id} not found`);
      }

      // Handle image upload logic: if image is provided, upload it, else keep the existing image URL
      const imageUrl = project.file
        ? await uploadToR2(project.file)
        : project.imageUrl || existingProject.imageUrl;

      // Update the project with new data
      return prisma.project.update({
        where: { id: parseInt(project.id) }, // Update project by its ID
        data: {
          ...project,
          imageUrl: imageUrl,
        },
      });
    });

    // Wait for all projects to be updated
    const updatedProjects = await Promise.all(updatedProjectsPromises);

    res.json({
      result: updatedProjects,
      message: `${updatedProjects.length} projects have been successfully updated.`,
      success: true,
    });
  } catch (error) {
    // Return a more detailed error if a specific project is not found
    res.status(500).json({
      message: "Error happened at calling endpoint (/edit-projects)",
      error: error,
      success: false,
    });
  }
};

export const deleteProject = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      result: { ...project },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/remove-project)",
      error: error,
      success: false,
    });
  }
};

export const deleteProjects = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    // Assuming req.body contains an array of project IDs to delete
    const { ids } = req.body; // Example: { ids: [1, 2, 3] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        message: "Invalid input format. Expected an array of project IDs.",
        success: false,
      });
    }

    // Deleting multiple projects by their IDs
    const deletedProjects = await prisma.project.deleteMany({
      where: {
        id: { in: ids.map((id) => parseInt(id)) }, // Deleting projects that match these IDs
      },
    });

    res.json({
      message: `${deletedProjects.count} projects have been successfully deleted.`,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error happened at calling endpoint (/delete-projects)",
      error: error,
      success: false,
    });
  }
};

// Export the multer middleware for use in your routes
export const uploadMiddleware = upload.single("photo");
