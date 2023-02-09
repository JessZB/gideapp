import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import morgan from "morgan";
import loginRouter from "./routes/login.routes.js";
import usersRouter from "./routes/users.routes.js";
import patientsRouter from "./routes/patients.routes.js";
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
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.text());

const __dirname = dirname(fileURLToPath(import.meta.url));
console.log(__dirname);
// Middleware para sessiones
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session

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

//routers
app.use(loginRouter);
app.use(usersRouter);
app.use(patientsRouter);

app.use(express.static(join(__dirname, "../build")))

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
