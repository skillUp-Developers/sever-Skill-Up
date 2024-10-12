import { PrismaClient } from '@prisma/client'
import hash from 'bcryptjs'
import { generateToken, userRequest } from '../secure/JWT'
import { Request, Response } from 'express'
const prisma = new PrismaClient()

export const createUser = async (req: Request, res: Response | any) => {
  try {
    const { email, userName, password } = req.body

    if (!email || !userName || !password) {
      return res.status(400).json({
        message: 'please provide into',
      })
    }

    const checkEmail = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (checkEmail) {
      return res.status(400).json({
        message: {
          email: 'email already exist!!',
        },
        isSuccess: false,
      })
    }

    const hashed = hash.hashSync(password)

    const newUser = await prisma.user.create({
      data: {
        email,
        userName,
        password: hashed,
        role: email === 'admin@gmail.com' ? 'ADMIN' : 'USER',
      },
      select: {
        id: true,
        email: true,
        userName: true,
        createAt: true,
        role: true,
      },
    })

    res.json({
      result: { ...newUser },
      isSuccess: true,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

export const allUser = async (req: userRequest, res: Response | any) => {
  try {
    if (req.user?.role === 'USER') {
      return res.status(401).json({
        message: 'unAuthorized!!',
      })
    }

    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        userName: true,
        email: true,
        role: true,
        createAt: true,
      },
    })

    res.json({
      result: [...allUsers],
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

export const userLogin = async (req: Request, res: Response | any) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        isSuccess: false,
        message: 'wrong credentials',
      })
    }

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      return res.status(404).json({
        message: 'wrong credentials',
      })
    }

    const dehash = hash.compareSync(password, user?.password)
    if (!dehash) {
      return res.status(400).json({
        message: 'wrong credentials',
      })
    }

    const result = {
      id: user?.id,
      email: user?.email,
      fullName: user?.userName,
      createAt: user?.createAt,
      role: user.role,
      token: generateToken({
        email: user?.email,
        id: user?.id,
        userName: user.userName,
        role: user.role,
      }),
    }

    res.json({
      result: { ...result },
      message: 'login successfully',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'server error',
      isSuccess: false,
    })
  }
}

export const changeRole = async (req: userRequest, res: Response | any) => {
  try {
    const { role, id } = req.body

    if (req.user?.role === 'USER') {
      return res.status(401).json({
        message: 'not allowed',
      })
    }

    if (!role) {
      return res.status(400).json({
        message: 'select  a role',
      })
    }

    const checkUser = await prisma.user.findFirst({
      where: {
        id: req.user?.id,
      },
    })

    if (!checkUser) {
      return res.status(400).json({
        message: 'not user exist!!',
      })
    }

    if (id === req.user?.id) {
      return res.status(400).json({
        message: 'not  allowed to change your own role!!',
      })
    }

    const change = await prisma.user.update({
      where: {
        id: +id,
      },
      data: {
        role,
      },
    })

    res.json({
      message: `user change role success!, ${change.role}`,
    })
  } catch (error) {
    res.status(500).json({
      message: 'server error',
    })
  }
}
