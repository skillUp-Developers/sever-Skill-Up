"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMiddleware = exports.updateTeam = exports.getTeam = exports.createTeam = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2"); // Ensure this function is implemented correctly
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage(); // Store files in memory
const upload = (0, multer_1.default)({ storage }); // Multer middleware
// Create a new team
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure the request contains the file
    const { name, skill, description } = req.body;
    const file = req.file;
    try {
        // Upload the file if present
        const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : ' ';
        // Create a new team entry in the database
        const newTeam = yield prisma.team.create({
            data: {
                name,
                skill,
                description,
                imageUrl, // Store the URL in the database
            },
        });
        res.status(201).json(newTeam);
    }
    catch (error) {
        console.error('Error creating team', error);
        res.status(500).json({ error: 'Error creating team' });
    }
});
exports.createTeam = createTeam;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const all = yield prisma.team.findMany();
        res.json({
            result: [...all],
        });
    }
    catch (error) {
        res.status(400).json({
            message: 'server error',
        });
    }
});
exports.getTeam = getTeam;
// Update team
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, skill, description, id } = req.body;
    const file = req.file;
    try {
        // Find the existing team
        const existingTeam = yield prisma.team.findUnique({
            where: { id: Number(id) },
        });
        if (!existingTeam) {
            res.status(404).json({ error: 'Team not found' });
            return; // Explicit return to stop further execution
        }
        // Handle image upload if a file is provided
        const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : existingTeam.imageUrl;
        // Update the team entry in the database
        const updatedTeam = yield prisma.team.update({
            where: { id: Number(id) },
            data: {
                name,
                skill,
                description,
                imageUrl, // Keep the existing image if none uploaded
            },
        });
        res.status(200).json(updatedTeam); // Send the updated team data
    }
    catch (error) {
        console.error('Error updating team', error);
        res.status(500).json({ error: 'Error updating team' });
    }
});
exports.updateTeam = updateTeam;
// Export the multer middleware for use in your routes
exports.uploadMiddleware = upload.single('photo');
