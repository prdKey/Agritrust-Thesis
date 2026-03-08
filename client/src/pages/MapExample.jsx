"use client";

import React, { useEffect, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
} from "@/components/ui/map";
import { Loader2 } from "lucide-react";

export function MapExample() {
  const sellerLocation = { lat: 15.841335, lng: 120.216652, name: "Seller" };
  const buyerLocation = { lat: 15.925885, lng: 120.348275, name: "Buyer" };

  const [logisticsLocation, setLogisticsLocation] = useState(null);
  const [sellerToLogisticsRoute, setSellerToLogisticsRoute] = useState([]);
  const [logisticsToBuyerRoute, setLogisticsToBuyerRoute] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  // Fetch both routes whenever logistics moves
  useEffect(() => {
    if (!logisticsLocation) return;

    async function fetchRoutes() {
      setIsLoading(true);
      try {
        // Seller → Logistics
        const res1 = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${sellerLocation.lng},${sellerLocation.lat};${logisticsLocation.lng},${logisticsLocation.lat}?overview=full&geometries=geojson`
        );
        const data1 = await res1.json();
        if (data1.routes?.length > 0)
          setSellerToLogisticsRoute(data1.routes[0].geometry.coordinates);

        // Logistics → Buyer
        const res2 = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${logisticsLocation.lng},${logisticsLocation.lat};${buyerLocation.lng},${buyerLocation.lat}?overview=full&geometries=geojson`
        );
        const data2 = await res2.json();
        if (data2.routes?.length > 0)
          setLogisticsToBuyerRoute(data2.routes[0].geometry.coordinates);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoutes();
  }, [logisticsLocation]);

  return (
    <div className="h-[500px] w-full relative">
      <Map
        center={[
          logisticsLocation?.lng || sellerLocation.lng,
          logisticsLocation?.lat || sellerLocation.lat,
        ]}
        zoom={12}
      >
        {/* Seller */}
        <MapMarker latitude={sellerLocation.lat} longitude={sellerLocation.lng}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-green-500 border-2 border-white shadow-lg" />
            <MarkerLabel position="top">{sellerLocation.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {/* Buyer */}
        <MapMarker latitude={buyerLocation.lat} longitude={buyerLocation.lng}>
          <MarkerContent>
            <div className="size-5 rounded-full bg-red-500 border-2 border-white shadow-lg" />
            <MarkerLabel position="bottom">{buyerLocation.name}</MarkerLabel>
          </MarkerContent>
        </MapMarker>

        {/* Logistics */}
        {logisticsLocation && (
          <MapMarker
            latitude={logisticsLocation.lat}
            longitude={logisticsLocation.lng}
          >
            <MarkerContent>
              <div className="size-5 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
              <MarkerLabel position="top">Logistics</MarkerLabel>
            </MarkerContent>
          </MapMarker>
        )}

        {/* Routes */}
        {sellerToLogisticsRoute.length > 0 && (
          <MapRoute
            coordinates={sellerToLogisticsRoute}
            color="#10b981" // green
            width={5}
            opacity={0.8}
          />
        )}
        {logisticsToBuyerRoute.length > 0 && (
          <MapRoute
            coordinates={logisticsToBuyerRoute}
            color="#6366f1" // blue
            width={5}
            opacity={0.8}
          />
        )}
      </Map>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
