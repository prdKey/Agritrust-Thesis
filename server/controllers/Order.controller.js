import { orderManagerContract } from "../blockchain/contract.js";
import { formatUnits } from "ethers";
import { User, OrderAddress } from "../models/index.js";
import { createNotification } from "./Notification.controller.js";

const formatOrder = (o) => ({
  id: Number(o.id),
  productId: Number(o.productId),
  buyerAddress: o.buyerAddress,
  sellerAddress: o.sellerAddress,
  logisticsAddress: o.logisticsAddress,
  quantity: Number(o.quantity),
  totalPrice: formatUnits(o.totalPrice, 18),
  productPrice: formatUnits(o.productPrice, 18),
  pricePerUnit: formatUnits(o.pricePerUnit, 18),
  name: o.name,
  category: o.category,
  status: Number(o.status),
  imageCID: o.imageCID,
  location: o.location,
  createdAt: Number(o.createdAt),
  confirmAt: Number(o.confirmAt),
  pickedUpAt: Number(o.pickedUpAt),
  outForDeliveryAt: Number(o.outForDeliveryAt),
  deliveredAt: Number(o.deliveredAt),
  completedAt: Number(o.completedAt),
  cancelledAt: Number(o.cancelledAt),
  platformFee: formatUnits(o.platformFee, 18),
  logisticsFee: formatUnits(o.logisticsFee, 18),
});

const enrichOrders = async (data) => {
  const users    = await User.findAll();
  const orderIds = data.map(o => Number(o.id));
  const addresses = await OrderAddress.findAll({ where: { orderId: orderIds } });

  return data.map(o => {
    const seller    = users.find(u => u.walletAddress?.toLowerCase() === o.sellerAddress?.toLowerCase());
    const buyer     = users.find(u => u.walletAddress?.toLowerCase() === o.buyerAddress?.toLowerCase());
    const logistics = users.find(u => u.walletAddress?.toLowerCase() === o.logisticsAddress?.toLowerCase());
    const addr      = addresses.find(a => a.orderId === Number(o.id));

    return {
      ...formatOrder(o),
      sellerName:        seller    ? `${seller.firstName} ${seller.lastName}`       : "Unknown",
      sellerLocation:    seller?.address || null,
      buyerName:         buyer     ? `${buyer.firstName} ${buyer.lastName}`         : "Unknown",
      buyerLocation:     addr?.fullAddress || null,
      logisticsName:     logistics ? `${logistics.firstName} ${logistics.lastName}` : null,
      logisticsLocation: o.location || null,
      deliveryAddress: addr ? {
        name:        addr.name,
        phone:       addr.phone,
        fullAddress: addr.fullAddress,
        houseNumber: addr.houseNumber,
        street:      addr.street,
        barangay:    addr.barangay,
        city:        addr.city,
        zipCode:     addr.zipCode,
      } : null,
    };
  });
};

// POST /api/orders/checkout
export const buyProduct = async (req, res) => {
  try {
    const buyerAddress = req.user.walletAddress;
    const { productId, quantity, deliveryAddress } = req.body;
    const tx      = await orderManagerContract.buyProduct(productId, quantity, buyerAddress);
    const receipt = await tx.wait();

    let orderId = null;
    for (const log of receipt.logs) {
      try {
        const parsed = orderManagerContract.interface.parseLog(log);
        if (parsed?.name === "OrderCreated") {
          orderId = parsed.args.orderId?.toString();
          break;
        }
      } catch (_) {}
    }

    // Fallback
    if (!orderId) {
      const count = await orderManagerContract.orderCount();
      orderId = count.toString();
    }

    // Save delivery address
    if (orderId && deliveryAddress) {
      await OrderAddress.create({
        orderId:     Number(orderId),
        addressId:   deliveryAddress.addressId || null,
        name:        deliveryAddress.name,
        phone:       deliveryAddress.phone,
        fullAddress: deliveryAddress.fullAddress,
        houseNumber: deliveryAddress.houseNumber || null,
        street:      deliveryAddress.street || null,
        barangay:    deliveryAddress.barangay,
        city:        deliveryAddress.city,
        zipCode:     deliveryAddress.zipCode || null,
      });
    }

    // Notify seller — new order received
    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.sellerAddress, {
      type:    "ORDER",
      title:   "New Order Received!",
      message: `You have a new order #${orderId} for ${order.name}. Please confirm shipment.`,
      orderId: Number(orderId),
    });

    res.json({ message: "Order created successfully", order: { id: orderId }, txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Seller confirms shipment → notify buyer
export const confirmShipment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const tx = await orderManagerContract.confirmShipment(orderId, req.user.walletAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.buyerAddress, {
      type:    "ORDER",
      title:   "Order Shipped!",
      message: `Your order #${orderId} (${order.name}) has been shipped and is waiting for logistics pickup.`,
      orderId: Number(orderId),
    });

    res.json({ message: "Shipment confirmed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Logistics marks out for delivery → notify buyer
export const markOutForDelivery = async (req, res) => {
  try {
    const { orderId } = req.body;
    const tx = await orderManagerContract.markOutForDelivery(orderId, req.user.walletAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.buyerAddress, {
      type:    "DELIVERY",
      title:   "Out for Delivery!",
      message: `Your order #${orderId} (${order.name}) is now out for delivery and will arrive soon!`,
      orderId: Number(orderId),
    });

    res.json({ message: "Marked out for delivery", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Logistics confirms delivery → notify buyer
export const confirmDelivery = async (req, res) => {
  try {
    const { orderId, location } = req.body;
    const tx = await orderManagerContract.confirmDeliveryByLogistics(orderId, location, req.user.walletAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.buyerAddress, {
      type:    "SUCCESS",
      title:   "Order Delivered!",
      message: `Your order #${orderId} (${order.name}) has been delivered. Please confirm receipt to release payment to the seller.`,
      orderId: Number(orderId),
    });

    res.json({ message: "Delivery confirmed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Buyer confirms receipt → notify seller
export const confirmReceipt = async (req, res) => {
  try {
    const { orderId } = req.body;
    const tx = await orderManagerContract.confirmReceipt(orderId, req.user.walletAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);

    // Notify seller — payment released
    await createNotification(order.sellerAddress, {
      type:    "SUCCESS",
      title:   "Payment Released!",
      message: `Order #${orderId} (${order.name}) has been completed. ${formatUnits(order.productPrice, 18)} AGT has been released to your wallet.`,
      orderId: Number(orderId),
    });

    // Notify buyer — order complete
    await createNotification(order.buyerAddress, {
      type:    "SUCCESS",
      title:   "Order Completed!",
      message: `Your order #${orderId} is complete. Don't forget to rate the product!`,
      orderId: Number(orderId),
    });

    res.json({ message: "Order completed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Seller cancels → notify buyer
export const cancelOrderBySeller = async (req, res) => {
  try {
    const { orderId } = req.body;
    const tx = await orderManagerContract.cancelOrderBySeller(orderId, req.user.walletAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.buyerAddress, {
      type:    "ALERT",
      title:   "Order Cancelled by Seller",
      message: `Order #${orderId} (${order.name}) has been cancelled by the seller. A full refund of ${formatUnits(order.totalPrice, 18)} AGT has been returned to your wallet.`,
      orderId: Number(orderId),
    });

    res.json({ message: "Order cancelled", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Buyer cancels → notify seller
export const cancelOrderByBuyer = async (req, res) => {
  try {
    const { orderId } = req.body;
    const tx = await orderManagerContract.cancelOrderByBuyer(orderId, req.user.walletAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.sellerAddress, {
      type:    "ALERT",
      title:   "Order Cancelled by Buyer",
      message: `Order #${orderId} (${order.name}) has been cancelled by the buyer. Stock has been restored.`,
      orderId: Number(orderId),
    });

    res.json({ message: "Order cancelled", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Open dispute → notify both parties + admin
export const openDispute = async (req, res) => {
  try {
    const { orderId }   = req.body;
    const senderAddress = req.user.walletAddress;
    const tx = await orderManagerContract.openDispute(orderId, senderAddress);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    const isBuyer = senderAddress.toLowerCase() === order.buyerAddress.toLowerCase();

    // Notify the other party
    const otherAddress = isBuyer ? order.sellerAddress : order.buyerAddress;
    const otherRole    = isBuyer ? "buyer" : "seller";
    await createNotification(otherAddress, {
      type:    "ALERT",
      title:   "Dispute Opened",
      message: `A dispute has been opened for Order #${orderId} (${order.name}) by the ${otherRole}. The admin will review and resolve it. Funds remain in escrow.`,
      orderId: Number(orderId),
    });

    res.json({ message: "Dispute opened", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

// Resolve dispute → notify buyer and seller
export const resolveDispute = async (req, res) => {
  try {
    const { orderId, refundBuyer } = req.body;
    const tx = await orderManagerContract.resolveDispute(orderId, refundBuyer);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);

    if (refundBuyer) {
      await createNotification(order.buyerAddress, {
        type:    "SUCCESS",
        title:   "Dispute Resolved — Refunded",
        message: `The dispute for Order #${orderId} has been resolved in your favor. ${formatUnits(order.totalPrice, 18)} AGT has been refunded to your wallet.`,
        orderId: Number(orderId),
      });
      await createNotification(order.sellerAddress, {
        type:    "ALERT",
        title:   "Dispute Resolved",
        message: `The dispute for Order #${orderId} (${order.name}) has been resolved. The buyer has been refunded.`,
        orderId: Number(orderId),
      });
    } else {
      await createNotification(order.sellerAddress, {
        type:    "SUCCESS",
        title:   "Dispute Resolved — Payment Released",
        message: `The dispute for Order #${orderId} has been resolved in your favor. ${formatUnits(order.productPrice, 18)} AGT has been released to your wallet.`,
        orderId: Number(orderId),
      });
      await createNotification(order.buyerAddress, {
        type:    "ALERT",
        title:   "Dispute Resolved",
        message: `The dispute for Order #${orderId} (${order.name}) has been resolved. Payment has been released to the seller.`,
        orderId: Number(orderId),
      });
    }

    res.json({ message: "Dispute resolved", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const data    = await orderManagerContract.getOrderById(orderId);
    const [order] = await enrichOrders([data]);
    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrdersBySeller = async (req, res) => {
  try {
    const data   = await orderManagerContract.getOrdersBySeller(req.user.walletAddress);
    const orders = await enrichOrders(data);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrdersByBuyer = async (req, res) => {
  try {
    const data   = await orderManagerContract.getOrdersByBuyer(req.user.walletAddress);
    const orders = await enrichOrders(data);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getAvailableOrders = async (req, res) => {
  try {
    const data   = await orderManagerContract.getAvailableOrders();
    const orders = await enrichOrders(data);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const data   = await orderManagerContract.getAllOrders();
    const orders = await enrichOrders(data);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrdersByLogistics = async (req, res) => {
  try {
    const data   = await orderManagerContract.getOrdersByLogistics(req.user.walletAddress);
    const orders = await enrichOrders(data);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const acceptOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const tx = await orderManagerContract.acceptOrder(orderId, req.user.walletAddress);
    await tx.wait();
    res.json({ message: "Order accepted", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const pickupOrder = async (req, res) => {
  try {
    const { orderId, location } = req.body;
    const tx = await orderManagerContract.pickupOrder(orderId, req.user.walletAddress, location);
    await tx.wait();

    const order = await orderManagerContract.getOrderById(orderId);
    await createNotification(order.buyerAddress, {
      type:    "DELIVERY",
      title:   "Order Picked Up",
      message: `Your order #${orderId} (${order.name}) has been picked up by the logistics provider and is on its way!`,
      orderId: Number(orderId),
    });

    res.json({ message: "Order picked up", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getDisputedOrders = async (req, res) => {
  try {
    const orderCount = Number(await orderManagerContract.orderCount());
    const disputed   = [];
    for (let i = 1; i <= orderCount; i++) {
      const o = await orderManagerContract.getOrderById(i);
      if (Number(o.status) === 7) disputed.push(o);
    }
    const orders = await enrichOrders(disputed);
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const updateOrderLocation = async (req, res) => {
  try {
    const { orderId, location } = req.body;
    const orderLocation = await OrderLocation.findOne({ where: { orderId } });
    if (!orderLocation) return res.status(404).json({ error: "Order location not found" });
    orderLocation.latitude  = location.latitude;
    orderLocation.longitude = location.longitude;
    await orderLocation.save();
    res.json({ message: "Order location updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrderAddress = async (req, res) => {
  try {
    const { orderId } = req.params;
    const address = await OrderAddress.findOne({ where: { orderId: Number(orderId) } });
    if (!address) return res.status(404).json({ error: "Delivery address not found" });
    res.json({ address });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};