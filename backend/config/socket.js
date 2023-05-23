const socket = require("socket.io");

const createSocket = (server) => {
    const io = socket(server, {
        pingTimeout: 60000,
        cors: {
            origin: "http://localhost:3000",
        },
    });

    io.on("connection", (socket) => {
        console.log("Connected to socket.io");
        socket.on("setup", (userData) => {
            socket.join(userData._id);
            socket.emit("connected");
        });

        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User Joined Room: " + room);
        });
        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
        socket.on("update chat", (room) => {
            socket.in(room).emit("update chat");
        });
        socket.on("new message", (newMessageRecieved) => {
            var chat = newMessageRecieved.chat;

            if (!chat.users) return console.log("chat.users not defined");

            chat.users.forEach((user) => {
                if (user._id == newMessageRecieved.sender._id) return;

                socket.in(user._id).emit("message recieved", newMessageRecieved);
            });
        });

        socket.off("setup", () => {
            console.log("USER DISCONNECTED");
            socket.leave(userData._id);
        });
    });

    return io;

};

module.exports = createSocket;