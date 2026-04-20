import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import weather from "./routes/weather.routes";
import { error } from "./middleware/error.middleware"

dotenv.config({ path: "./.env" });
const app = express()

app.use(cors({
  origin: "http://localhost:4200",
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/weather", weather);

app.use(error); 

const port = Number(process.env["PORT"])|| 5000;
app.listen(port, () => {
    console.log(`Server is listening on http://localhost:${port}`);
});

