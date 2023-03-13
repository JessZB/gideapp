import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import morgan from "morgan";

// Rutas
import loginRouter from "./routes/login.routes.js";
import usersRouter from "./routes/users.routes.js";
import patientsRouter from "./routes/patients.routes.js";
import vaccinesRouter from "./routes/vaccines.routes.js";
import vaccinationsRouter from "./routes/vaccinations.routes.js";
import examsRouter from "./routes/exams.routes.js";
import backupsRouter from "./routes/backups.routes.js";
import questionsRouter from "./routes/questions.routes.js";
import recoveryRouter from "./routes/recovery.routes.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { PORT } from "./config/config.js";
const app = express();

dotenv.config();
// Para usar objetos JSON, texto y cookies
app.use(
  cors({
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.text());

export const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
// Middleware para sessiones
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Sesión
app.use(
  session({
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
    secret: "session",
    cookie: {
      maxAge: 100 * 60 * 60,
      sameSite: "lax",
      secure: false,
    },
  })
);
console.log(__dirname)
//routers
app.use(loginRouter);
app.use(usersRouter);
app.use(patientsRouter);
app.use(vaccinesRouter);
app.use(vaccinationsRouter);
app.use(examsRouter);
app.use(backupsRouter);
app.use(questionsRouter);
app.use(recoveryRouter);

app.use("/",express.static(join(__dirname, "../dist")))
app.use("/login",express.static(join(__dirname, "../dist")))
app.use("/app/*",express.static(join(__dirname, "../dist")))

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
