"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("./routes/users/User"));
const teamRoutes_1 = __importDefault(require("./routes/teams/teamRoutes"));
const Project_1 = __importDefault(require("./routes/projects/Project"));
const category_1 = __importDefault(require("./routes/categories/category"));
const ClientRouter_1 = __importDefault(require("./routes/client/ClientRouter"));
const JobsRouter_1 = __importDefault(require("./routes/jobs/JobsRouter"));
const app = (0, express_1.default)();
dotenv_1.default.config();
const port = process.env.port;
app.use((0, cors_1.default)({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
//endPoints
app.use('/api/user', User_1.default);
app.use('/api/teams', teamRoutes_1.default);
app.use('/api/project', Project_1.default);
app.use('/api/categories', category_1.default);
app.use('/api/client', ClientRouter_1.default);
app.use('/api/job', JobsRouter_1.default);
app.listen(port, () => console.log(`server running ${port}`));
