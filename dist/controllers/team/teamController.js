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
exports.updateTeam = exports.createTeam = void 0;
const client_1 = require("@prisma/client");
const uploadToR2_1 = require("../../lib/uploadToR2");
const multer_1 = __importDefault(require("multer"));
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)(); // Multer to handle multipart form data
// Create a new team
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, skill, description } = req.body;
    const file = req.file;
    try {
        const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : null;
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
        console.error("Error creating team", error);
        res.status(500).json({ error: 'Error creating team' });
    }
});
exports.createTeam = createTeam;
// Update team
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, skill, description } = req.body;
    const file = req.file;
    try {
        const existingTeam = yield prisma.team.findUnique({ where: { id: Number(id) } });
        if (!existingTeam) {
            return res.status(404).json({ error: "Team not found" });
        }
        const imageUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : existingTeam.imageUrl;
        const updatedTeam = yield prisma.team.update({
            where: { id: Number(id) },
            data: {
                name,
                skill,
                description,
                imageUrl,
            },
        });
        res.status(200).json(updatedTeam);
    }
    catch (error) {
        console.error("Error updating team", error);
        res.status(500).json({ error: 'Error updating team' });
    }
});
exports.updateTeam = updateTeam;
