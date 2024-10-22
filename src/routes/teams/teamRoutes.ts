import express from 'express'

import {
  createTeam,
  getTeam,
  updateTeam,
  uploadMiddleware,
} from '../../controllers/teams/Team'

const router = express.Router()

// Add routes for team CRUD with image uploads
router.post('/', uploadMiddleware, createTeam)
router.get('/all', getTeam)
router.put('/teams/update', uploadMiddleware, updateTeam);

export default router
