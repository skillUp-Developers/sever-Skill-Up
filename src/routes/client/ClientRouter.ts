import express, { Router } from 'express'
import {
  allClients,
  createClient,
  deleteClient,
  updateClients,
  uploadMiddleware,
} from '../../controllers/clients/Clients'

const router: Router = express.Router()

router.get('/all', allClients)

router.post('/new', uploadMiddleware, createClient)

router.put('/update', uploadMiddleware, updateClients)

router.delete('/delete/:id', deleteClient)

export default router
