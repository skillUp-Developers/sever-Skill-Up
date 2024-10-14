import express, { Router } from 'express'
import {
  allClients,
  createClient,
  deleteClient,
  updateClients,
  uploadMiddleware,
} from '../../controllers/clients/Clients'
import { decoded } from '../../controllers/secure/JWT'

const router: Router = express.Router()

router.get('/all', allClients)

router.post('/new',decoded, uploadMiddleware, createClient)

router.put('/edit/:id', uploadMiddleware, updateClients)

router.delete('/delete/:id', deleteClient)

export default router
