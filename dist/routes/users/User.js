"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const JWT_1 = require("../../controllers/secure/JWT");
const User_1 = require("../../controllers/users/User");
const router = express_1.default.Router();
router.post('/new', User_1.createUser);
router.post('/login', User_1.userLogin);
router.get('/all', JWT_1.decoded, User_1.allUser);
router.put('/role', JWT_1.decoded, User_1.changeRole);
exports.default = router;
