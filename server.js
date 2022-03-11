const {Server} = require('socket.io');
const dontenv = require('dotenv').config();
const io = new Server({
    cors:{
        origin:"http://localhost:3000"
    },
});

let activeUsers = [];

const addUser=(userId,socketId)=>{
    !activeUsers.some((user) => user.userId === userId) && activeUsers.push({userId,socketId});
}

const removeUser = (socketId)=>{
    activeUsers = activeUsers.filter(user=>user.socketId !== socketId);
}
const getUser = (userId)=>{
    return activeUsers.find(user => user.userId === userId);
}
io.on("connection",(socket)=>{

    socket.on("addUser",(userId)=>{
        addUser(userId,socket.id);
        io.emit("getUsers",activeUsers);
    })

    socket.on("sendMessage",({senderId,recieverId,text})=>{
        const user = getUser(recieverId);
        io.to(user.socketId).emit("getMessage",{
            senderId,
            text
        });
    })

    socket.on("disconnect",()=>{
        removeUser(socket.id);
        io.emit("getUsers",activeUsers);
    })
})

 

io.listen(process.env.PORT,()=>{
    console.log("websocket server is running on port 8900...");
})