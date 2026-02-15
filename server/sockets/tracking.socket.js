export default function trackingSocket(io, socket) {

    socket.on("joinOrderRoom", (orderId) => {
        console.log(`Socket ${socket.id} joining order room: ${orderId}`);
        socket.join(orderId);
    });
    socket.on("sendLocation", (data) => {
    console.log(`Received location update for order ${data.orderId}: ${data.lat}, ${data.lng}`);
    io.to(`order-${data.orderId}`).emit("locationUpdate", {
        lat: data.lat,
        lng: data.lng
        });
    });

}
