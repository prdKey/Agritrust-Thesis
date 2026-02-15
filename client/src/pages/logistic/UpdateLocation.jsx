import { useEffect } from "react";
import {socket} from "../../services/socket.js";

export default function UpdateLocation() {

    useEffect(() => {
        if (!socket.connected) socket.connect();
        // Simulate sending location updates every 5 seconds
        const interval = setInterval(() => {
            const data = {
                orderId: "4", // Example order ID
                lat: 15.841335 + Math.random() * 0.1, // Simulated latitude
                lng: 120.216652 + Math.random() * 0.1 // Simulated longitude
            };
            socket.emit("sendLocation", data);
        }, 20000);

        return () => clearInterval(interval);
    }, []);


  return null; // This component doesn't render anything
}
