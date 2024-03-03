import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server, {   
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

app.get("/", (req, res) => {
  res.send("Hello World");
});
app.get('/favicon.ico', (req, res) => res.status(204));



io.on("connection", (socket) => {
         
  console.log("User Connected:", socket.id);

  socket.on("message", (data) => {
    console.log("Received message:", data);
    //use broadcast to send meassagr to other socket exept its own //good for group chat
   // socket.broadcast.emit("receive-message", data);
    //use emit to send message to all socket include its own  
    //io.emit("receive-message", data);
    //to send data to particular room
    socket.to(data.room).emit("receive-message", data.message);  // while using to() methid whetther we use (socket or io) it doesnt matter both do same work 
  });
     
  //to join room(Joining room is like creating a new group and joining it)
  //one room can have multiple socket(and each socket has unique id)
    socket.on("join-room", (room) => {
      socket.join(room);
      
    console.log("User joined room:", room);
    });
   
  socket.on("disconnect", () => {
    console.log("User disconnected. Socket ID:", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
