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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setInActive = exports.setActive = exports.allInActiveJobs = exports.allActiveJobs = exports.updateJob = exports.createJob = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, link, description } = req.body;
        if (!name || !link) {
            return res.status(400).json({
                message: 'please provide into',
            });
        }
        const editJob = yield prisma.job.create({
            data: {
                name,
                link,
                description,
            },
        });
        res.json({
            result: Object.assign({}, editJob),
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
exports.createJob = createJob;
// update
const updateJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, link, description } = req.body;
        if (!name || !link || !description) {
            return res.status(400).json({
                message: 'please provide into',
            });
        }
        const editJob = yield prisma.job.update({
            where: {
                id: +id,
            },
            data: {
                name,
                link,
                description,
            },
        });
        res.json({
            result: Object.assign({}, editJob),
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
exports.updateJob = updateJob;
//
//get job active jobs
const allActiveJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allJob = yield prisma.job.findMany({
            where: {
                isActive: true,
            },
        });
        res.json({
            result: [...allJob],
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            isSuccess: false,
        });
    }
});
exports.allActiveJobs = allActiveJobs;
//get job Inactive jobs
const allInActiveJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allJob = yield prisma.job.findMany({
            where: {
                isActive: false,
            },
        });
        res.json({
            result: [...allJob],
        });
    }
    catch (error) {
        res.status(500).json({
            message: 'server error',
            isSuccess: false,
        });
    }
});
exports.allInActiveJobs = allInActiveJobs;
// set Active
const setActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const editJob = yield prisma.job.update({
            where: {
                id: +id,
            },
            data: {
                isActive: true,
            },
        });
        res.json({
            result: Object.assign({}, editJob),
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
exports.setActive = setActive;
// set InActive
const setInActive = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const editJob = yield prisma.job.update({
            where: {
                id: +id,
            },
            data: {
                isActive: false,
            },
        });
        res.json({
            result: Object.assign({}, editJob),
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
exports.setInActive = setInActive;
