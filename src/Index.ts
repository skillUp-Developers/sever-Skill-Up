import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import user from "./routes/users/User";
import teamRoutes from "./routes/teams/teamRoutes";
import project from "./routes/projects/Project";

const app = express();
dotenv.config();
const port = process.env.port;
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

//endPoints

app.use("/api/user", user);
app.use("/api/teams", teamRoutes);
app.use("/api/project", project);

app.listen(port, () => console.log(`server running ${port}`));
