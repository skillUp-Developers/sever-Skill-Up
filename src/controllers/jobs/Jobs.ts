import { PrismaClient } from '@prisma/client'
import hash from 'bcryptjs'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

export const createJob = async (req: Request, res: Response | any) => {
  try {
    const { name, link, description } = req.body

    if (!name || !link ) {
      return res.status(400).json({
        message: 'please provide into',
      })
    }

    const editJob = await prisma.job.create({
      data: {
        name,
        link,
        description,
      },
    })

    res.json({
      result: { ...editJob },
      isSuccess: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

// update

export const updateJob = async (req: Request, res: Response | any) => {
  try {
    const {id} = req.params
    const { name, link, description } = req.body

    if (!name || !link || !description) {
      return res.status(400).json({
        message: 'please provide into',
      })
    }

    const editJob = await prisma.job.update({
      where: {
        id: +id,
      },
      data: {
        name,
        link,
        description,
      },
    })

    res.json({
      result: { ...editJob },
      isSuccess: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

//

//get job active jobs

export const allActiveJobs = async (req: Request, res: Response | any) => {
  try {
    const allJob = await prisma.job.findMany({
      where: {
        isActive: true,
      },
    })

    res.json({
      result: [...allJob],
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

//get job Inactive jobs

export const allInActiveJobs = async (req: Request, res: Response | any) => {
  try {
    const allJob = await prisma.job.findMany({
      where: {
        isActive: false,
      },
    })

    res.json({
      result: [...allJob],
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

// set Active

export const setActive = async (req: Request, res: Response | any) => {
  try {
    const { id } = req.params

    const editJob = await prisma.job.update({
      where: {
        id: +id,
      },
      data: {
        isActive: true,
      },
    })

    res.json({
      result: { ...editJob },
      isSuccess: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}
// set InActive

export const setInActive = async (req: Request, res: Response | any) => {
  try {
    const { id } = req.params

    const editJob = await prisma.job.update({
      where: {
        id: +id,
      },
      data: {
        isActive: false,
      },
    })

    res.json({
      result: { ...editJob },
      isSuccess: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}
