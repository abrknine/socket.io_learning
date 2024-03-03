
import {Box,Stack, Container, TextField, Button, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { io } from 'socket.io-client';  


const App = () => {
  
  const socket = useMemo(() => io("http://localhost:3000", { withCredentials: true }), []);



  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [room, setRoom] = useState('');
  const [socketId, setSocketId] = useState('');
  const [roomName, setRoomName] = useState('');   

   const joinRoomHandler = (e) => {
    e.preventDefault();
       socket.emit('join-room', roomName);
       setRoomName("");

   }
  const handleSubmit = (e) => {
    e.preventDefault(); 
    socket.emit('message', {message,room});
    setMessage("");

  };

  // to establish connection with server
  useEffect(() => {
    socket.on('connect', () => {
      setSocketId(socket.id);
      console.log('connected', socket.id);
    });
       
    socket.on('receive-message', (data) => {
      console.log(data);
      setMessages((messages) => [...messages, data]);
    });


    socket.on('welcome', (data) => {
      console.log(data);
      socket.emit("message", data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Container maxWidth="sm">
      <Box sx={{height:500}}/>
      <Typography variant="h6" component="div" gutterBottom>
        Welcome to Socket IO
      </Typography>

      <Typography variant="h2" component="div" gutterBottom> {socketId}</Typography>

     <form action=""  onSubmit={ joinRoomHandler }>
<h5>Join Room</h5>
<TextField
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          id="outlined-basic"
          label="Room Name"
          variant="outlined"
        />
        <Button  variant="contained" color="primary" type="submit">
          join
        </Button>


     </form>
      <form action="" onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
         <TextField
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          id="outlined-basic"
          label="room"
          variant="outlined"
        />
        <Button  variant="contained" color="primary" type="submit">
          Send
        </Button>
      </form>
      <Stack>
        {messages.map((msg, index) => (

          <Typography key={index} variant="h6" component="div" gutterBottom>
            {msg} 
          </Typography>
        ))}

      </Stack>
    </Container>
  );
};

export default App;
