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
import productRoute from "./routes/productsRoute.js";
import productCategoryRoute from "./routes/productCategoryRoute.js";
import supplierRoute from "./routes/supplierRoute.js";
import notReusableBatteryRoute from "./routes/notReusableBatteryRoute.js";
import buyBackRouter from "./routes/buyBackRoute.js";

dotenv.config();

const api = process.env.API_URL;
const port = process.env.PORT;

const app = express();

app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(
  cors({
    origin: "http://localhost:3000", // Next.js URL
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); // Enable CORS
app.use(cookieParser()); // Parse cookies
app.use(morgan("dev")); // Log HTTP requests

app.use(`${api}/auth`, authroute); // Use auth routes
app.use(`${api}/sale`, saleRoute); // Use sale routes
app.use(`${api}/customer`, customerRoute); // Use customer routes
app.use(`${api}/product`, productRoute); // Use product routes
app.use(`${api}/category`, productCategoryRoute); //User category routes
app.use(`${api}/supplier`, supplierRoute); // Use supplier routes
app.use(`${api}/not-reusable-battery`, notReusableBatteryRoute); // Use not reusable battery routes
app.use(`${api}/buy-back`, buyBackRouter); // Use buy-back routes

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}${api}`);
  connectDb(); // Connect to the database
  createDefaultAdmin(); // Create default admin user
});
