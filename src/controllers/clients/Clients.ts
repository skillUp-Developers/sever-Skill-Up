import { Request, Response } from 'express'
import { projectRequest } from '../secure/JWT'
import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import { uploadToR2 } from '../../lib/uploadToR2'

const prisma = new PrismaClient()

// Configure multer for file uploads
const storage = multer.memoryStorage()
const upload = multer({ storage })

// create clients

export const createClient = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        message: 'please provide info',
        isSuccess: false,
      })
    }

    const file: Express.Multer.File | undefined = req.file

    // Upload the file if present
    const logoUrl = file ? await uploadToR2(file) : ''

    const client = await prisma.client.create({
      data: {
        name,
        description,
        logoUrl,
      },
    })
    res.json({
      result: { ...client },
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error,
      success: false,
    })
  }
}

//get All clients

export const allClients = async (req: Request, res: Response | any) => {
  try {
    const clients = await prisma.client.findMany()

    res.json({
      result: [...clients],
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error,
      success: false,
    })
  }
}

//update client

export const updateClients = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { id, name, description } = req.body

    const file = req.file

    const existingClient = await prisma.client.findUnique({
      where: { id: Number(id) },
    })

    if (!existingClient) {
      return res.status(404).json({ error: 'Client not found' })
    }

    // Handle image upload
    const logoUrl = file ? await uploadToR2(file) : existingClient.logoUrl

    const client = await prisma.client.update({
      where: { id: parseInt(id) },
      data: { name, description, logoUrl },
    })
    res.json({
      result: { ...client },
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error,
      success: false,
    })
  }
}

//delete

export const deleteClient = async (
  req: projectRequest,
  res: Response | any
) => {
  try {
    const { id } = req.params

    const existClient = await prisma.client.findFirst({
      where: {
        id: +id,
      },
    })

    if (!existClient) {
      return res.status(400).json({
        message: 'client not exist!',
      })
    }

    const project = await prisma.client.delete({
      where: { id: parseInt(id) },
    })
    res.json({
      result: { ...project },
      success: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error,
      success: false,
    })
  }
}

//export upload

export const uploadMiddleware = upload.single('logoUrl')
