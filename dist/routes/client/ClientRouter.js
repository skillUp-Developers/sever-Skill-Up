"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Clients_1 = require("../../controllers/clients/Clients");
const router = express_1.default.Router();
router.get('/all', Clients_1.allClients);
router.post('/new', Clients_1.uploadMiddleware, Clients_1.createClient);
router.put('/update', Clients_1.uploadMiddleware, Clients_1.updateClients);
router.delete('/delete/:id', Clients_1.deleteClient);
exports.default = router;
