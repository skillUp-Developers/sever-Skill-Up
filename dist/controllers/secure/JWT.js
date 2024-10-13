"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decoded = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (user) => {
    const payload = user;
    return jsonwebtoken_1.default.sign(payload, process.env.SECRETKEY, { expiresIn: '30d' });
};
exports.generateToken = generateToken;
const decoded = (req, res, next) => {
    var _a, _b;
    try {
        const token = ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer')) &&
            ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1]);
        if (!token) {
            return res.status(400).json({
                message: 'unAuthorized!',
                isSuccess: false,
            });
        }
        const decode = jsonwebtoken_1.default.verify(token, process.env.SECRETKEY);
        req.user = Object.assign({}, decode);
        next();
    }
    catch (error) {
        res.status(500).json({
            message: 'token error',
        });
    }
};
exports.decoded = decoded;
