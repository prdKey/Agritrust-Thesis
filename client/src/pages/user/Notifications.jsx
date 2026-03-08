import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { 
  Bell, 
  Package, 
  ShoppingBag, 
  Truck,
  CheckCircle,
  AlertCircle,
  Info,
  Trash2,
  Check,
  Filter,
  BellOff
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NotificationsPage() {
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call
      // const data = await getNotifications();
      // setNotifications(data.notifications);
      
      // Mock data
      const mockNotifications = [
        {
          id: 1,
          type: "ORDER",
          title: "Order Confirmed",
          message: "Your order #123 has been confirmed and is being prepared for shipment.",
          timestamp: Date.now() - 1000 * 60 * 30, // 30 mins ago
          read: false,
          orderId: 123
        },
        {
          id: 2,
          type: "DELIVERY",
          title: "Out for Delivery",
          message: "Your order #122 is out for delivery and will arrive today.",
          timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 hours ago
          read: false,
          orderId: 122
        },
        {
          id: 3,
          type: "SUCCESS",
          title: "Order Delivered",
          message: "Your order #121 has been delivered successfully. Please confirm receipt.",
          timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
          read: true,
          orderId: 121
        },
        {
          id: 4,
          type: "INFO",
          title: "New Products Available",
          message: "Check out the latest products from your favorite sellers!",
          timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2 days ago
          read: true
        },
        {
          id: 5,
          type: "ALERT",
          title: "Payment Reminder",
          message: "Your order #120 is awaiting payment. Complete payment to proceed.",
          timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3 days ago
          read: true,
          orderId: 120
        }
      ];
      setNotifications(mockNotifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    // TODO: Call API to mark as read
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    // TODO: Call API to mark all as read
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    // TODO: Call API to delete notification
  };

  const deleteAllRead = () => {
    if (!window.confirm("Delete all read notifications?")) return;
    setNotifications(prev => prev.filter(notif => !notif.read));
    // TODO: Call API to delete all read
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      ORDER: { icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-100" },
      DELIVERY: { icon: Truck, color: "text-purple-600", bg: "bg-purple-100" },
      SUCCESS: { icon: CheckCircle, color: "text-green-600", bg: "bg-green-100" },
      ALERT: { icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-100" },
      INFO: { icon: Info, color: "text-gray-600", bg: "bg-gray-100" },
    };
    return iconMap[type] || iconMap.INFO;
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !notif.read;
    if (filter === "READ") return notif.read;
    return notif.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 rounded-lg">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                Notifications
              </h1>
              <p className="text-gray-600 mt-2">
                {unreadCount > 0 ? (
                  <span className="font-semibold text-green-600">{unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</span>
                ) : (
                  "You're all caught up!"
                )}
              </p>
            </div>

            {notifications.length > 0 && (
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <Check size={16} />
                    Mark all read
                  </button>
                )}
                <button
                  onClick={deleteAllRead}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Clear read
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          <Filter size={18} className="text-gray-500 flex-shrink-0" />
          {["ALL", "UNREAD", "READ", "ORDER", "DELIVERY", "SUCCESS", "ALERT", "INFO"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="text-gray-400 mb-4">
              <BellOff className="w-20 h-20 mx-auto" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No notifications</h2>
            <p className="text-gray-600">
              {filter === "ALL" 
                ? "You don't have any notifications yet"
                : `No ${filter.toLowerCase()} notifications`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const iconData = getNotificationIcon(notification.type);
              const Icon = iconData.icon;

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-lg shadow-sm border transition-all duration-200 overflow-hidden ${
                    !notification.read
                      ? "border-green-300 border-l-4"
                      : "border-gray-200 hover:shadow-md"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 ${iconData.bg} p-3 rounded-lg`}>
                        <Icon className={iconData.color} size={24} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                            )}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600 mb-3">
                          {notification.message}
                        </p>

                        {/* Actions */}
                        <div className="flex items-center gap-3 flex-wrap">
                          {notification.orderId && (
                            <button 
                              onClick={() => navigate(`/track-order/${notification.orderId}`)}
                              className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                              View Order #{notification.orderId}
                            </button>
                          )}
                          
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                            >
                              <Check size={14} />
                              Mark as read
                            </button>
                          )}
                          
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 ml-auto"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {notifications.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{notifications.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Unread</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{unreadCount}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Orders</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {notifications.filter(n => n.type === "ORDER").length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Deliveries</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {notifications.filter(n => n.type === "DELIVERY").length}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 text-center">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Alerts</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {notifications.filter(n => n.type === "ALERT").length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}