import UserMod from '../../src/model/user'

declare global{
  namespace Express {
      interface Request {
        user?: UserMod
      }
  }
}
