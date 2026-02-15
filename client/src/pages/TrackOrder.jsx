import { socket } from "../services/socket.js";
import React, { useEffect, useState } from "react";
import {
  Map,
  MapMarker,
  MarkerContent,
  MapRoute,
  MarkerLabel,
} from "@/components/ui/map";
import { 
  Package, 
  CheckCircle2, 
  Truck, 
  MapPin,
  Clock,
  User,
  DollarSign,
  Box,
  Phone
} from "lucide-react";
import { getOrderById } from "../services/orderService.js";
import { useParams, useNavigate } from "react-router-dom";

export default function OrderTracker() {
  const [logisticsLocation, setLogisticsLocation] = useState(null);
  const [sellerToLogisticsRoute, setSellerToLogisticsRoute] = useState([]);
  const [logisticsToBuyerRoute, setLogisticsToBuyerRoute] = useState([]);
  const [orderStatus, setOrderStatus] = useState(1);
  
  const [orderData, setOrderData] = useState({
    id: "",
    productId: 0,
    buyerAddress: "",
    sellerAddress: "",
    logisticsAddress: "",
    quantity: 0,
    totalPrice: 0,
    productPrice: 0,
    pricePerUnit: 0,
    platformFee: 0,
    logisticsFee: 0,
    name: "",
    category: "",
    imageCID: "",
    location: "",
    createdAt: 0,
    confirmAt: 0,
    pickedUpAt: 0,
    outForDeliveryAt: 0,
    deliveredAt: 0,
    completedAt: 0,
    // New fields
    sellerName: "",
    sellerLocation: null,
    sellerMobile: "",
    buyerName: "",
    buyerLocation: null,
    buyerMobile: "",
    logisticsName: "",
    logisticsMobile: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { orderId } = useParams();
  const navigate = useNavigate();

  // Convert address to coordinates (helper function)
  const getCoordinatesFromAddress = (location) => {
    if (!location) return null;
    // You can use geocoding API here, for now using default coordinates
    // In production, you should geocode the actual address
    return {
      lat: location.latitude || 16.4023, // Default to Baguio area
      lng: location.longitude || 120.5960
    };
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || timestamp === 0) return "";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatAddress = (location) => {
    if (!location) return "N/A";
    return `#${location.houseNumber}, ${location.street}, ${location.barangay}, ${location.city}`;
  };

  // Fetch order data on mount
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await getOrderById(orderId);
        setOrderData(res.order);
        setOrderStatus(res.order.status);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch order data:", err);
        setError("Failed to load order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  // Socket: receive live logistics updates
  useEffect(() => {
    if (!orderId) return;

    if (!socket.connected) socket.connect();

    const handleLocationUpdate = (data) => {
      console.log("Received location update:", data);
      setLogisticsLocation({ lat: data.lat, lng: data.lng });
      
      if (data.status !== undefined) {
        setOrderStatus(data.status);
      }
    };

    const handleStatusUpdate = (data) => {
      console.log("Received status update:", data);
      setOrderStatus(data.status);
      
      const now = Math.floor(Date.now() / 1000);
      
      setOrderData(prev => {
        const updated = { ...prev };
        if (data.status === 2) updated.confirmAt = now;
        if (data.status === 3) updated.pickedUpAt = now;
        if (data.status === 4) updated.outForDeliveryAt = now;
        if (data.status === 5) updated.deliveredAt = now;
        if (data.status === 6) updated.completedAt = now;
        return updated;
      });
    };

    socket.emit("joinOrderRoom", `order-${orderId}`);
    socket.on("locationUpdate", handleLocationUpdate);
    socket.on("statusUpdate", handleStatusUpdate);

    return () => {
      socket.off("locationUpdate", handleLocationUpdate);
      socket.off("statusUpdate", handleStatusUpdate);
      socket.emit("leaveOrderRoom", `order-${orderId}`);
    };
  }, [orderId]);

  // Get actual locations from order data
  const sellerLocation = { lat: 16.5023, lng: 120.5960, name: "Seller" };
  const buyerLocation = { lat: 16.4123, lng: 120.6060, name: "Buyer" };

  // Fetch routes whenever logistics location updates
  useEffect(() => {
    if (!logisticsLocation) return;

    async function fetchRoutes() {
      try {
        const res1 = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${sellerLocation.lng},${sellerLocation.lat};${logisticsLocation.lng},${logisticsLocation.lat}?overview=full&geometries=geojson`
        );
        const data1 = await res1.json();
        if (data1.routes?.length > 0)
          setSellerToLogisticsRoute(data1.routes[0].geometry.coordinates);

        const res2 = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${logisticsLocation.lng},${logisticsLocation.lat};${buyerLocation.lng},${buyerLocation.lat}?overview=full&geometries=geojson`
        );
        const data2 = await res2.json();
        if (data2.routes?.length > 0)
          setLogisticsToBuyerRoute(data2.routes[0].geometry.coordinates);
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    }

    fetchRoutes();
  }, [logisticsLocation]);

  const steps = [
    { 
      icon: DollarSign, 
      label: "Paid",
      time: formatTimestamp(orderData.createdAt),
      status: 1
    },
    { 
      icon: CheckCircle2, 
      label: "Shipped",
      time: formatTimestamp(orderData.confirmAt),
      status: 2
    },
    { 
      icon: Box, 
      label: "Picked Up",
      time: formatTimestamp(orderData.pickedUpAt),
      status: 3
    },
    { 
      icon: Truck, 
      label: "Out for Delivery",
      time: formatTimestamp(orderData.outForDeliveryAt),
      status: 4
    },
    { 
      icon: MapPin, 
      label: "Delivered",
      time: formatTimestamp(orderData.deliveredAt),
      status: 5
    },
    { 
      icon: User, 
      label: "Completed",
      time: formatTimestamp(orderData.completedAt),
      status: 6
    },
  ];

  const getStatusLabel = (status) => {
    const labels = ['NONE', 'PAID', 'SHIPPED', 'PICKED UP', 'OUT FOR DELIVERY', 'DELIVERED', 'COMPLETED', 'DISPUTED', 'REFUNDED'];
    return labels[status] || 'UNKNOWN';
  };

  const getStatusColor = (status) => {
    if (status === 6) return 'text-green-600';
    if (status === 7) return 'text-red-600';
    if (status === 8) return 'text-yellow-600';
    if (status >= 4) return 'text-blue-600';
    return 'text-green-600';
  };

  const trackingHistory = [
    orderData.completedAt && orderData.completedAt !== 0 && { 
      date: formatTimestamp(orderData.completedAt), 
      status: "Completed", 
      desc: "Order has been completed - Thank you for your purchase!" 
    },
    orderData.deliveredAt && orderData.deliveredAt !== 0 && { 
      date: formatTimestamp(orderData.deliveredAt), 
      status: "Delivered", 
      desc: `Parcel delivered by ${orderData.logisticsName || 'logistics provider'}` 
    },
    orderData.outForDeliveryAt && orderData.outForDeliveryAt !== 0 && { 
      date: formatTimestamp(orderData.outForDeliveryAt), 
      status: "Out for Delivery", 
      desc: "Parcel is out for delivery to your location" 
    },
    orderData.pickedUpAt && orderData.pickedUpAt !== 0 && { 
      date: formatTimestamp(orderData.pickedUpAt), 
      status: "Picked Up", 
      desc: `Parcel picked up by ${orderData.logisticsName || 'logistics provider'}` 
    },
    orderData.confirmAt && orderData.confirmAt !== 0 && { 
      date: formatTimestamp(orderData.confirmAt), 
      status: "Shipped", 
      desc: `Order confirmed by ${orderData.sellerName || 'seller'}` 
    },
    orderData.createdAt && orderData.createdAt !== 0 && { 
      date: formatTimestamp(orderData.createdAt), 
      status: "Paid", 
      desc: `Order placed - ${orderData.quantity}x ${orderData.name}` 
    },
  ].filter(Boolean);

  const currentStepIndex = steps.findIndex(s => s.status === orderStatus);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-lg text-gray-600">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm text-gray-600">
              ORDER ID: <span className="font-semibold">#{orderData.id || orderId}</span>
            </h3>
            <span className={`text-sm font-medium ${getStatusColor(orderStatus)}`}>
              {getStatusLabel(orderStatus)}
            </span>
          </div>
          
          {/* Order Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-gray-500">Product:</span>
              <p className="font-medium text-gray-800">{orderData.name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Quantity:</span>
              <p className="font-medium text-gray-800">{orderData.quantity} units</p>
            </div>
            <div>
              <span className="text-gray-500">Product Price:</span>
              <p className="font-medium text-gray-800">{orderData.productPrice} AGT</p>
            </div>
            <div>
              <span className="text-gray-500">Total Paid:</span>
              <p className="font-medium text-gray-800">{orderData.totalPrice} AGT</p>
            </div>
          </div>
          
          {/* Fee Breakdown */}
          <div className="mt-2 text-xs text-gray-500">
            <span>Platform Fee: {orderData.platformFee} AGT • </span>
            <span>Logistics Fee: {orderData.logisticsFee} AGT</span>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
              <div 
                className="h-full bg-green-600 transition-all duration-500"
                style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0}%` }}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = step.status <= orderStatus;
              const isCurrent = step.status === orderStatus;

              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? "bg-green-600 border-green-600"
                        : "bg-white border-gray-300"
                    } ${isCurrent ? "ring-4 ring-green-100" : ""}`}
                  >
                    <Icon
                      size={20}
                      className={isActive ? "text-white" : "text-gray-400"}
                    />
                  </div>
                  <p
                    className={`mt-2 text-xs text-center max-w-[80px] ${
                      isActive ? "text-gray-800 font-medium" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-xs text-gray-400 mt-1">{step.time}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            {/* Seller Info */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                <Package size={14} className="text-blue-600" />
                Seller
              </h4>
              <p className="font-medium text-gray-800 mb-1">{orderData.sellerName || "Unknown"}</p>
              <p className="text-gray-600 mb-1">{formatAddress(orderData.sellerLocation)}</p>
              {orderData.sellerMobile && (
                <a 
                  href={`tel:${orderData.sellerMobile}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
                >
                  <Phone size={12} />
                  {orderData.sellerMobile}
                </a>
              )}
            </div>

            {/* Logistics Info */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                <Truck size={14} className="text-green-600" />
                Logistics
              </h4>
              <p className="font-medium text-gray-800 mb-1">{orderData.logisticsName || "Not assigned yet"}</p>
              {orderData.logisticsMobile && (
                <a 
                  href={`tel:${orderData.logisticsMobile}`}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800 font-medium"
                >
                  <Phone size={12} />
                  {orderData.logisticsMobile}
                </a>
              )}
            </div>

            {/* Buyer Info */}
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-1">
                <User size={14} className="text-purple-600" />
                Delivery To
              </h4>
              <p className="font-medium text-gray-800 mb-1">{orderData.buyerName || "Unknown"}</p>
              <p className="text-gray-600 mb-1">{formatAddress(orderData.buyerLocation)}</p>
              {orderData.buyerMobile && (
                <a 
                  href={`tel:${orderData.buyerMobile}`}
                  className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
                >
                  <Phone size={12} />
                  {orderData.buyerMobile}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Map Section */}
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                Live Tracking
              </h4>
              <p className="text-xs text-gray-500">
                {orderData.location || 'Tracking location will appear here'}
              </p>
            </div>
            <div className="h-80 rounded-lg overflow-hidden border border-gray-200">
              <Map
                center={[
                  logisticsLocation?.lng || sellerLocation.lng,
                  logisticsLocation?.lat || sellerLocation.lat,
                ]}
                zoom={13}
              >
                <MapMarker
                  latitude={sellerLocation.lat}
                  longitude={sellerLocation.lng}
                >
                  <MarkerContent>
                    <div className="size-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                    <MarkerLabel position="top">Seller</MarkerLabel>
                  </MarkerContent>
                </MapMarker>

                <MapMarker
                  latitude={buyerLocation.lat}
                  longitude={buyerLocation.lng}
                >
                  <MarkerContent>
                    <div className="size-4 rounded-full bg-purple-500 border-2 border-white shadow-lg" />
                    <MarkerLabel position="bottom">Buyer</MarkerLabel>
                  </MarkerContent>
                </MapMarker>

                {logisticsLocation && (
                  <MapMarker
                    latitude={logisticsLocation.lat}
                    longitude={logisticsLocation.lng}
                  >
                    <MarkerContent>
                      <div className="size-4 rounded-full bg-green-500 border-2 border-white shadow-lg animate-pulse" />
                      <MarkerLabel position="top">Logistics</MarkerLabel>
                    </MarkerContent>
                  </MapMarker>
                )}

                {sellerToLogisticsRoute.length > 0 && (
                  <MapRoute
                    coordinates={sellerToLogisticsRoute}
                    color="#10b981"
                    width={4}
                    opacity={0.7}
                  />
                )}
                {logisticsToBuyerRoute.length > 0 && (
                  <MapRoute
                    coordinates={logisticsToBuyerRoute}
                    color="#6366f1"
                    width={4}
                    opacity={0.7}
                  />
                )}
              </Map>
            </div>
          </div>

          {/* Tracking History */}
          <div>
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-1">
                Delivery Timeline
              </h4>
              <p className="text-xs text-gray-500">
                Track your order status updates
              </p>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {trackingHistory.length > 0 ? (
                trackingHistory.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-3 pb-3 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-shrink-0">
                      <Clock size={16} className="text-gray-500 mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs text-gray-500">{item.date}</span>
                        <span className="text-xs font-semibold text-gray-600">
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-700">{item.desc}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No tracking history available</p>
              )}
            </div>
            
            {/* Contract Addresses */}
            <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200 text-xs">
              <p className="font-semibold mb-2 text-gray-700">Smart Contract Details</p>
              <div className="space-y-1 text-gray-600">
                <p>
                  <span className="font-medium">Buyer:</span>{" "}
                  {orderData.buyerAddress 
                    ? `${orderData.buyerAddress.slice(0, 10)}...${orderData.buyerAddress.slice(-8)}`
                    : 'N/A'
                  }
                </p>
                <p>
                  <span className="font-medium">Seller:</span>{" "}
                  {orderData.sellerAddress 
                    ? `${orderData.sellerAddress.slice(0, 10)}...${orderData.sellerAddress.slice(-8)}`
                    : 'N/A'
                  }
                </p>
                <p><span className="font-medium">Product ID:</span> {orderData.productId || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center flex-wrap gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            ← Back to Orders
          </button>
          <div className="flex gap-3">
            {orderData.sellerMobile && (
              <a
                href={`tel:${orderData.sellerMobile}`}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Phone size={14} />
                Contact Seller
              </a>
            )}
            {orderData.logisticsMobile && orderStatus >= 3 && orderStatus < 6 && (
              <a
                href={`tel:${orderData.logisticsMobile}`}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Phone size={14} />
                Contact Logistics
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}