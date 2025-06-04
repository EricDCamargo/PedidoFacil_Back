import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import prismaClient from '../prisma'
import { io } from '../server'
import { SocketEvents } from '../@types/socket'

export async function logMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (req.method === 'GET') {
      return next()
    }
    const token = req.headers.authorization?.split(' ')[1]
    let user_id: string | null = null

    if (token) {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET || 'default_secret'
      ) as {
        sub: string
        name: string
        email: string
        role: string
      }
      user_id = decodedToken.sub
    }

    const details = JSON.stringify({
      params: req.params,
      body: req.body
    })

    await prismaClient.log.create({
      data: {
        user_id,

        route: req.path,
        method: req.method,
        details
      }
    })

    await io.emit(SocketEvents.LOG_CREATED)
  } catch (error) {
    console.error('Erro ao registrar log:', error)
  }

  next()
}
