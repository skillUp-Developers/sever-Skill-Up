import { PrismaClient } from '@prisma/client';
import { uploadToR2 } from '../../lib/uploadToR2'; // Ensure this function is implemented correctly
import multer, {Multer} from 'multer';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage });  // Multer middleware

// Create a new team
export const createTeam = async (req: Request, res: Response) => {
  // Ensure the request contains the file
  const { name, skill, description } = req.body;
  const file: Express.Multer.File | undefined = req.file;

  try {
    // Upload the file if present
    const imageUrl = file ? await uploadToR2(file) : ' ';

    // Create a new team entry in the database
    const newTeam = await prisma.team.create({
      data: {
        name,
        skill,
        description,
        imageUrl, // Store the URL in the database
      },
    });

    res.status(201).json(newTeam);
  } catch (error) {
    console.error("Error creating team", error);
    res.status(500).json({ error: 'Error creating team' });
  }
};

// Update team
export const updateTeam = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, skill, description } = req.body;
  const file = req.file;

  try {
    const existingTeam = await prisma.team.findUnique({ where: { id: Number(id) } });

    if (!existingTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Handle image upload
    const imageUrl = file ? await uploadToR2(file) : existingTeam.imageUrl;

    // Update the team entry in the database
    const updatedTeam = await prisma.team.update({
      where: { id: Number(id) },
      data: {
        name,
        skill,
        description,
        imageUrl,
      },
    });

    res.status(200).json(updatedTeam);
  } catch (error) {
    console.error("Error updating team", error);
    res.status(500).json({ error: 'Error updating team' });
  }
};

// Export the multer middleware for use in your routes
export const uploadMiddleware = upload.single('photo'); 
