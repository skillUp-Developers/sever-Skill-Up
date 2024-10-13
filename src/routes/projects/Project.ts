import express, { Router } from "express";

const router: Router = express.Router();

router.get(
  "/get-projects"
  // getProjects
);
router.get(
  "/get-project/:id"
  // getProject
);

router.post(
  "/add-project"
  // addProject
);
router.post(
  "/add-projects"
  // addProjects
);

router.post(
  "/edit-project"
  // editProject
);

router.post(
  "/edit-projects"
  // editProjects
);

router.delete(
  "/remove-project"
  // removeProject
);
router.delete(
  "/remove-projects"
  // removeProjects
);

export default router;
