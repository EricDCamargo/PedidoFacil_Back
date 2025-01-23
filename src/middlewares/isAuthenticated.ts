import { Request, NextFunction, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { Role } from '../@types/types'

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
    return res.status(401).json({ error: 'Token is missing' }).end()
  }

  const [, token] = authToken.split(' ')

  try {
    const { sub, role } = verify(token, process.env.JWT_SECRET) as Payload

    req.user_id = sub
    req.user_role = role

    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' }).end()
  }
} // Verify access level
export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user_role !== Role.admin) {
    return res.status(403).json({ error: 'Permission denied' })
  }

  return next()
}
