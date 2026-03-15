import type http from "http";
import { Server as SocketServer } from "socket.io";
import jwt from "jsonwebtoken";

let io: SocketServer | null = null;

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const initSocketServer = (server: http.Server): SocketServer => {
	if (!io) {
		io = new SocketServer(server, {
			cors: {
				origin: ["http://localhost:8080", "http://localhost:4200"],
				methods: ["GET", "POST"],
			},
			path: "/socket.io",
		});

		// Middleware de autenticación para Socket.io
		io.use((socket, next) => {
			const token = socket.handshake.auth.token || socket.handshake.headers.authorization;
			
			if (!token) {
				return next(new Error("Authentication error: Token missing"));
			}

			const cleanToken = token.startsWith("Bearer ") ? token.substring(7) : token;

			try {
				const decoded = jwt.verify(cleanToken, JWT_SECRET);
				(socket as any).user = decoded;
				next();
			} catch (err) {
				next(new Error("Authentication error: Invalid token"));
			}
		});

		io.on("connection", (socket) => {
			const user = (socket as any).user;
			console.log(`Client authenticated: ${socket.id} (User: ${user?.email})`);

			socket.on("disconnect", () => {
				console.log("Client disconnected:", socket.id);
			});
		});

		console.log("Socket.io server initialized with Authentication");
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
		io.emit("pet-reported", {
			type: "NEW_PET",
			message: `Nueva mascota reportada: ${pet.name}`,
			pet: pet,
			timestamp: new Date(),
		});
	}
};
