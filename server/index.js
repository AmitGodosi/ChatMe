const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const conversationRoutes = require("./routes/conversation");
const messageRoutes = require("./routes/message");
const usersRoutes = require("./routes/user");
const path = require("path");

dotenv.config();
app.use(cors());

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/conversation", conversationRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/message", messageRoutes);

//DEPLOYMENT
// const __dirname1 = path.resolve();
// app.use(express.static(path.join(__dirname1, "/client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
// });
//DEPLOYMENT

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT} !`);
});
