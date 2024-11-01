import express, { Router } from "express";
import {
  addProject,
  addProjects,
  deleteProject,
  deleteProjects,
  editProject,
  editProjects,
  getProject,
  getProjects,
  uploadMiddleware,
} from "../../controllers/projects/Project";

const router: Router = express.Router();

router.get("/get-projects", getProjects);
router.get("/get-project/:id", getProject);

router.post("/add-project",uploadMiddleware, addProject);
router.post("/add-projects", addProjects);

router.post("/edit-project/:id",uploadMiddleware, editProject);

router.post("/edit-projects", editProjects);

router.delete("/delete-project/:id", deleteProject);
router.delete("/delete-projects", deleteProjects);

export default router;
