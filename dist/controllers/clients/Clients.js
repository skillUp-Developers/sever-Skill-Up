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
exports.uploadMiddleware = exports.deleteClient = exports.updateClients = exports.allClients = exports.createClient = void 0;
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const uploadToR2_1 = require("../../lib/uploadToR2");
const prisma = new client_1.PrismaClient();
// Configure multer for file uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// create clients
const createClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({
                message: 'please provide info',
                isSuccess: false,
            });
        }
        const file = req.file;
        // Upload the file if present
        const logoUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : '';
        const client = yield prisma.client.create({
            data: {
                name,
                description,
                logoUrl,
            },
        });
        res.json({
            result: Object.assign({}, client),
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error,
            success: false,
        });
    }
});
exports.createClient = createClient;
//get All clients
const allClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const clients = yield prisma.client.findMany();
        res.json({
            result: [...clients],
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error,
            success: false,
        });
    }
});
exports.allClients = allClients;
//update client
const updateClients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, description } = req.body;
        const file = req.file;
        const existingClient = yield prisma.client.findUnique({
            where: { id: Number(id) },
        });
        if (!existingClient) {
            return res.status(404).json({ error: 'Client not found' });
        }
        // Handle image upload
        const logoUrl = file ? yield (0, uploadToR2_1.uploadToR2)(file) : existingClient.logoUrl;
        const client = yield prisma.client.update({
            where: { id: parseInt(id) },
            data: { name, description, logoUrl },
        });
        res.json({
            result: Object.assign({}, client),
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error,
            success: false,
        });
    }
});
exports.updateClients = updateClients;
//delete
const deleteClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existClient = yield prisma.client.findFirst({
            where: {
                id: +id,
            },
        });
        if (!existClient) {
            return res.status(400).json({
                message: 'client not exist!',
            });
        }
        const project = yield prisma.client.delete({
            where: { id: parseInt(id) },
        });
        res.json({
            result: Object.assign({}, project),
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            error: error,
            success: false,
        });
    }
});
exports.deleteClient = deleteClient;
//export upload
exports.uploadMiddleware = upload.single('logoUrl');
