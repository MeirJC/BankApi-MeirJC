import express, { json } from "express";
import router from "./routes/routes.js";
const app = express();

const PORT = process.env.PORT || 5000;
// const PORT = 3500;

app.use(json());

app.use("/api/accounts", router);

app.listen(PORT, () => {
  console.log(`Server is up @ Port ${PORT}`);
});
