export default function orderSocket(io, socket) {

  socket.on("orderStatusUpdate", (data) => {
    // broadcast to everyone in the order
    io.to(data.orderId).emit("orderStatusUpdated", data);
  });

}
