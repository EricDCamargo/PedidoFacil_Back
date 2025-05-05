import { Request, NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { Role } from '../@types/types'
import { StatusCodes } from 'http-status-codes'

interface Payload {
  sub: string
  role: Role
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authToken = req.headers.authorization

  if (!authToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token não encontrado!' })
      .end()
  }

  const [, token] = authToken.split(' ')

  try {
    const { sub, role } = verify(token, process.env.JWT_SECRET) as Payload

    req.user_id = sub
    req.user_role = role

    return next()
  } catch (err) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ error: 'Token invalido ou expirado!' })
      .end()
  }
} // Verify access level
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user_role !== Role.ADMIN) {
    return res.status(403).json({ error: 'Permisão negada!' })
  }

  return next()
}
