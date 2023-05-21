const express = require("express");
const chats = require("./data/data");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const colors = require("colors");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const User = require("./models/userModel");
const createSocket = require("./config/socket");

dotenv.config();
connectDB();
const app = express();
//app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}))
app.use(express.json());

app.get("/", (req, res) => {
  res.send("APi is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.get("/verify/:uniqueString", async (req, res) => {
  const { uniqueString } = req.params;
  const filter = { activationKey: uniqueString };
  const update = { activated: true };
  const user = await User.findOneAndUpdate(filter, update, {
    new: true,
  });
});
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, console.log("Server has started".yellow.bold));

const io = createSocket(server);