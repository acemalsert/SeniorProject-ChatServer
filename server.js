const {Server} = require('socket.io');

const io = new Server({
    cors:{
        origin:"http://localhost:3000"
    },
});


io.on("connection",(socket)=>{
    console.log("Hello from socket server!",socket);
})

 

io.listen(8900,()=>{
    console.log("websocket server is running on port 8900...");
})