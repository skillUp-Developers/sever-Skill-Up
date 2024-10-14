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
exports.changeRole = exports.userLogin = exports.allUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const JWT_1 = require("../secure/JWT");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, userName, password } = req.body;
        if (!email || !userName || !password) {
            return res.status(400).json({
                message: 'please provide into',
            });
        }
        const checkEmail = yield prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (checkEmail) {
            return res.status(400).json({
                message: {
                    email: 'email already exist!!',
                },
                isSuccess: false,
            });
        }
        const hashed = bcryptjs_1.default.hashSync(password);
        const newUser = yield prisma.user.create({
            data: {
                email,
                userName,
                password: hashed,
                role: email === 'admin@gmail.com' ? 'ADMIN' : 'USER',
            },
            select: {
                id: true,
                email: true,
                userName: true,
                createAt: true,
                role: true,
            },
        });
        res.json({
            result: Object.assign({}, newUser),
            isSuccess: true,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            isSuccess: false,
        });
    }
});
exports.createUser = createUser;
const allUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'USER') {
            return res.status(401).json({
                message: 'unAuthorized!!',
            });
        }
        const allUsers = yield prisma.user.findMany({
            select: {
                id: true,
                userName: true,
                email: true,
                role: true,
                createAt: true,
            },
        });
        res.json({
            result: [...allUsers],
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            isSuccess: false,
        });
    }
});
exports.allUser = allUser;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                isSuccess: false,
                message: 'wrong credentials',
            });
        }
        const user = yield prisma.user.findFirst({
            where: {
                email,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: 'wrong credentials',
            });
        }
        const dehash = bcryptjs_1.default.compareSync(password, user === null || user === void 0 ? void 0 : user.password);
        if (!dehash) {
            return res.status(400).json({
                message: 'wrong credentials',
            });
        }
        const result = {
            id: user === null || user === void 0 ? void 0 : user.id,
            email: user === null || user === void 0 ? void 0 : user.email,
            fullName: user === null || user === void 0 ? void 0 : user.userName,
            createAt: user === null || user === void 0 ? void 0 : user.createAt,
            role: user.role,
            token: (0, JWT_1.generateToken)({
                email: user === null || user === void 0 ? void 0 : user.email,
                id: user === null || user === void 0 ? void 0 : user.id,
                userName: user.userName,
                role: user.role,
            }),
        };
        res.json({
            result: Object.assign({}, result),
            message: 'login successfully',
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'server error',
            isSuccess: false,
        });
    }
});
exports.userLogin = userLogin;
const changeRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { role, id } = req.body;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === 'USER') {
            return res.status(401).json({
                message: 'not allowed',
            });
        }
        if (!role) {
            return res.status(400).json({
                message: 'select  a role',
            });
        }
        const checkUser = yield prisma.user.findFirst({
            where: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
            },
        });
        if (!checkUser) {
            return res.status(400).json({
                message: 'not user exist!!',
            });
        }
        if (id === ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id)) {
            return res.status(400).json({
                message: 'not  allowed to change your own role!!',
            });
        }
        const change = yield prisma.user.update({
            where: {
                id: +id,
            },
            data: {
                role,
            },
        });
        res.json({
            message: `user change role success!, ${change.role}`,
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
        });
    }
});
exports.changeRole = changeRole;
