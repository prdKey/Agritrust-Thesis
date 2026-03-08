import { useEffect } from "react";
import {socket} from "../../services/socket.js";

export default function UpdateLocation() {

    useEffect(() => {
        if (!socket.connected) socket.connect();
        // Simulate sending location updates every 5 seconds
        const interval = setInterval(() => {
            const data = {
                orderId: "9", // Example order ID
                lat: 16.5023 + Math.random() * 0.1, // Simulated latitude
                lng: 120.5960 + Math.random() * 0.1 // Simulated longitude
            };
            socket.emit("sendLocation", data);
        }, 5000);
     
        return () => clearInterval(interval);
    }, []);


  return null; // This component doesn't render anything
}
