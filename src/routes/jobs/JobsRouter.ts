import { Router } from 'express'
import {
  allActiveJobs,
  allInActiveJobs,
  createJob,
  setActive,
  setInActive,
  updateJob,
} from '../../controllers/jobs/Jobs'
const router = Router()

router.post('/new', createJob)
router.get('/active', allActiveJobs)
router.get('/inactive', allInActiveJobs)
router.put('/update-job/:id', updateJob)
router.put('/set-active/:id', setActive)
router.put('/set-inactive/:id', setInActive)

export default router
