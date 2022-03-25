const io = require("socket.io")(8900, {
    cors: {
      origin: "http://localhost:3000",
    },
  });
  
  let active_users = [];
  
  const addUser = (userId, socketId) => {
    !active_users.some((user) => user.userId === userId) &&
      active_users.push({ userId, socketId });
  };
  
  const removeUser = (socketId) => {
    active_users = active_users.filter((user) => user.socketId !== socketId);
  };
  
  const getUser = (userId) => {
    return active_users.find((user) => user.userId === userId);
  };
  
  io.on("connection", (socket) => {
    //when ceonnect
    console.log("New connection with socketId",socket.id);
  
    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id);
        io.emit("getUsers", active_users);
    });
  
    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if(user){
          io.to(user.socketId).emit("getMessage", {
            senderId,
            text,
          });
      }
    });
  
    //when disconnect
    socket.on("disconnect", () => {
      console.log(`[Disconnected] `,socket.id);
      removeUser(socket.id);
      io.emit("getUsers", active_users);
    });
  });