import express, { Request, Response } from "express";
import { mainRoute } from "./routes/main";
const app = express();
const port = 3000;
app.use(express.json());
app.use("/", mainRoute);
app.use(express.static("public"));
app.get("/actions.json", (req: Request, res: Response) => {
  res.json({
    rules: [
      {
        pathPattern: "/**",
        apiPath: "/**",
      },
    ],
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
