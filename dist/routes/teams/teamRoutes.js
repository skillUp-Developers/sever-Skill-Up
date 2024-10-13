"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teamController_1 = require("../controllers/team/teamController");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)(); // Initialize multer
// Add routes for team CRUD with image uploads
router.post('/teams', upload.single('photo'), teamController_1.createTeam);
router.put('/teams/:id', upload.single('photo'), teamController_1.updateTeam);
exports.default = router;
