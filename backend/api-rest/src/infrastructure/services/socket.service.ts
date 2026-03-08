import { Server as SocketServer } from 'socket.io';
import http from 'http';

let io: SocketServer | null = null;

export const initSocketServer = (server: http.Server): SocketServer => {
    if (!io) {
        io = new SocketServer(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            },
            path: '/socket.io'
        });

        io.on('connection', (socket) => {
            console.log('Client connected:', socket.id);

            socket.on('disconnect', () => {
                console.log('Client disconnected:', socket.id);
            });
        });

        console.log('Socket.io server initialized');
    }
    return io;
};

export const getSocketIO = (): SocketServer | null => {
    return io;
};

export const emitNewPetReported = (pet: {
    id: string;
    name: string;
    status: string;
    kind?: string;
}) => {
    if (io) {
        io.emit('pet-reported', {
            type: 'NEW_PET',
            message: `Nueva mascota reportada: ${pet.name}`,
            pet: pet,
            timestamp: new Date()
        });
    }
};
