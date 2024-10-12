import express, { Router } from 'express'
import { decoded } from '../../controllers/secure/JWT'
import {
  allUser,
  changeRole,
  createUser,
  userLogin,
} from '../../controllers/users/User'

const router: Router = express.Router()
router.post('/new', createUser)
router.post('/login', userLogin)
router.get('/all', decoded, allUser)
router.put('/role', decoded, changeRole)

export default router
