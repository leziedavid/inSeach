import { io, Socket } from "socket.io-client";
import { getBaseUrl } from "@/types/baseUrl";

let socket: Socket | null = null;

export const connectNotificationSocket = (userId: string) => {

    if (socket) return socket;
    socket = io(getBaseUrl(), { transports: ["websocket"],  auth: { userId, },});
    socket.on("connect", () => {  console.log("🟢 WebSocket connecté");});
    socket.on("disconnect", () => {  console.log("🔴 WebSocket déconnecté");});
    return socket;
};

export const onNotificationReceived = ( callback: (notification: any) => void ) => {
    if (!socket) return;
    socket.on("notification", callback);
};

export const disconnectNotificationSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
