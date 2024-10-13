import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express'
import { userData } from '../interfaces/UserInterface'
import { projectData } from '../interfaces/ProjectInterface'

export const generateToken = (user: userData) => {
  const payload = user
  return jwt.sign(payload, process.env.SECRETKEY!, { expiresIn: '30d' })
}

export interface userRequest extends Request {
  user?: userData
}

export interface projectRequest extends Request {
  user?: projectData;
}

export const decoded: any = (
  req: userRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.headers.authorization?.startsWith('Bearer') &&
      req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(400).json({
        message: 'unAuthorized!',
        isSuccess: false,
      })
    }

    const decode: userData | any = jwt.verify(token, process.env.SECRETKEY!)

    req.user = { ...decode }
    next()
  } catch (error) {
    res.status(500).json({
      message: 'token error',
    })
  }
}
