const http = require('http').createServer();
const io = require('socket.io')(http, {
   cors: { origin: "*" }
});

io.on("connection", (socket) => {
    // socket.emit("message", "Server is conected");
    socket.emit("message", Math.random() * 100, Math.random() * 100,Math.random() * 100)
    setInterval (()=> socket.emit("message", Math.random() * 100, Math.random() * 100,Math.random() * 100),5000)
    setTimeout(() =>{
        window.clearInterval();
    }, 60000)
    // socket.emit("message", 10,400, 22)
});

 http.listen(3000, () => console.log('listening on http://localhost:3000') );
