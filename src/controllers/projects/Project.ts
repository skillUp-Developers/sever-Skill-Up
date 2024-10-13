import { Response } from "express";
import { projectRequest } from "../secure/JWT";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const getProjects = async (req: projectRequest, res: Response | any) => {
  try {
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        photo: true,
        createAt: true,
        updateAt: true,
      },
    });

    res.json({
      result: [...projects],
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
export const getProject = async (req: projectRequest, res: Response | any) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        description: true,
        photo: true,
        createAt: true,
        updateAt: true,
      },
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
    const { name, description, photo } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        photo,
      },
      select: {
        id: true,
        name: true,
        description: true,
        photo: true,
        createAt: true,
        updateAt: true,
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
    const projects = req.body;

    // Create multiple projects using prisma.createMany
    const createdProjects = await prisma.project.createMany({
      data: projects, // Here, we're expecting an array of project objects
      skipDuplicates: true, // Optional: skips creating if the project already exists based on unique fields
    });

    res.json({
      result: createdProjects,
      message: `${createdProjects.count} projects have been successfully added.`,
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

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: req.body,
      select: {
        id: true,
        name: true,
        description: true,
        photo: true,
        createAt: true,
        updateAt: true,
      },
    });
    res.json({
      result: { ...project },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "error happened at calling endpoint (/edit-project)",
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
    const projects = req.body; // Example: [{ id: 1, name: 'New Name', description: 'New Description' }, ...]

    const updatedProjectsPromises = projects.map(async (project: any) => {
      return prisma.project.update({
        where: { id: parseInt(project.id) }, // Update project by its ID
        data: {
          name: project.name,
          description: project.description,
          photo: project.photo,
        },
        select: {
          id: true,
          name: true,
          description: true,
          photo: true,
          createAt: true,
          updateAt: true,
        },
      });
    });

    const updatedProjects = await Promise.all(updatedProjectsPromises);

    res.json({
      result: updatedProjects,
      message: `${updatedProjects.length} projects have been successfully updated.`,
      success: true,
    });
  } catch (error) {
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
      select: {
        id: true,
        name: true,
        description: true,
        photo: true,
        createAt: true,
        updateAt: true,
      },
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
