import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDb from "./db/connectDb.js";
import { createDefaultAdmin } from "./utils/defaultAdmin.js";
import authroute from "./routes/authRoute.js";
import saleRoute from "./routes/saleRoute.js";
import customerRoute from "./routes/customerRoute.js";

dotenv.config();

const api = process.env.API_URL;
const port = process.env.PORT;

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev")); // Log HTTP requests

app.use(`${api}/auth`, authroute); // Use auth routes
app.use(`${api}/sale`, saleRoute); // Use sale routes
app.use(`${api}/customer`, customerRoute); // Use customer routes

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}${api}`);
  connectDb(); // Connect to the database
  createDefaultAdmin(); // Create default admin user
});
