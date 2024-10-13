import express from 'express';

import { createTeam, updateTeam, uploadMiddleware} from '../../controllers/teams/Team';

const router = express.Router();


// Add routes for team CRUD with image uploads
router.post('/', uploadMiddleware, createTeam);
// router.put('/teams/:id', uploadMiddleware, updateTeam);

export default router;