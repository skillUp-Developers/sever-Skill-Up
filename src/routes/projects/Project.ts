import express, { Router } from "express";
import {
  addProject,
  addProjects,
  deleteProject,
  deleteProjects,
  editProject,
  editProjects,
  getProjects,
} from "../../controllers/projects/Project";

const router: Router = express.Router();

router.get("/get-projects", getProjects);
router.get(
  "/get-project/:id"
  //   getProject
);

router.post("/add-project", addProject);
router.post("/add-projects", addProjects);

router.post("/edit-project", editProject);

router.post("/edit-projects", editProjects);

router.delete("/delete-project", deleteProject);
router.delete("/remove-projects", deleteProjects);

export default router;
