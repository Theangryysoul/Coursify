import express from "express";

const app = express();

app.get("/", (_, res) => {
  res.send("Coursify Backend is running 🚀");
});

export default app;