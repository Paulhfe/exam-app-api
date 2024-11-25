import express from "express";
import bodyParser from "body-parser";
import Database from "./database/Database";
import routes from "./routes/index";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(bodyParser.json());

Database();

app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/test", (req, res) => {
  res.json({ message: "Test route working!" });
});

export default app;
