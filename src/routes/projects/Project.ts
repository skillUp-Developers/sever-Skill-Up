import express, { Router } from "express";

const router: Router = express.Router();

router.get(
  "/get-projects"
  // getProjects
);

router.post(
  "/add-project"
  // addProject
);

router.post(
  "/edit-project"
  // editProject
);

router.delete(
  "/remove-project"
  // removeProject
);

export default router;
