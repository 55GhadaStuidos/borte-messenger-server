const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on('connection', (socket) => {
    socket.on('join_node', (nodeTag) => {
        socket.join(nodeTag);
    });

    socket.on('send_msg', (data) => {
        io.to(data.nodeTag).emit('receive_msg', data);
    });
});

module.exports = (req, res) => {
    if (!res.socket.server.io) {
        res.socket.server.io = io;
        io.attach(res.socket.server);
    }
    res.end();
};
