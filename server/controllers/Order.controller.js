import { orderManagerContract } from "../blockchain/contract.js"
import { User } from "../models/index.js";
import { formatUnits } from "ethers"; // Make sure this import exists

/* Helper function to format order from blockchain */
const formatOrder = (o) => ({
  id: Number(o.id),
  productId: Number(o.productId),
  buyerAddress: o.buyerAddress,
  sellerAddress: o.sellerAddress,
  logisticsAddress: o.logisticsAddress,
  quantity: Number(o.quantity),
  // Keep prices as strings to avoid overflow
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
  logisticsFee: formatUnits(o.logisticsFee, 18)
});

/* CREATE ORDER */
export const buyProduct = async (req, res) => {
  try {
    const buyerAddress = req.user.walletAddress
    const { productId, quantity} = req.body;

    const tx = await orderManagerContract.buyProduct(productId, quantity, buyerAddress);
    await tx.wait();

    res.json({ message: "Order created successfully", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

/* CONFIRM SHIPMENT */
export const confirmShipment = async (req, res) => {
  try {
    const sellerAddress = req.user.walletAddress
    const { orderId } = req.body;
    console.log(orderId)

    const tx = await orderManagerContract.confirmShipment(orderId, sellerAddress);
    await tx.wait();

    res.json({ message: "Shipment confirmed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const data = await orderManagerContract.getOrderById(orderId);
    const users = await User.findAll();
    
    const seller = users.find(
      u => u.walletAddress.toLowerCase() === data.sellerAddress.toLowerCase()
    );
    const buyer = users.find(
      u => u.walletAddress.toLowerCase() === data.buyerAddress.toLowerCase()
    );
    const logistics = users.find(
      u => u.walletAddress.toLowerCase() === data.logisticsAddress.toLowerCase()
    );
    
    const order = {
      ...formatOrder(data),
      sellerLocation: seller?.address || null,
      sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Unknown",
      sellerMobile: seller?.mobileNumber || null,
      buyerLocation: buyer?.address || null,
      buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Unknown",
      buyerMobile: buyer?.mobileNumber || null,
      logisticsName: logistics ? `${logistics.firstName} ${logistics.lastName}` : null,
      logisticsMobile: logistics?.mobileNumber || null,
    };

    res.json({ order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  } 
}

/* GET ORDERS BY SELLER */
export const getOrdersBySeller = async (req, res) => {
  try {
    const sellerAddress = req.user.walletAddress;
    const data = await orderManagerContract.getOrdersBySeller(sellerAddress);
    const users = await User.findAll();
    
    const orders = data.map((o) => {
      const seller = users.find(
        u => u.walletAddress.toLowerCase() === o.sellerAddress.toLowerCase()
      );
      const buyer = users.find(
        u => u.walletAddress.toLowerCase() === o.buyerAddress.toLowerCase()
      );
      const logistics = users.find(
        u => u.walletAddress.toLowerCase() === o.logisticsAddress.toLowerCase()
      );
      
      return {
        ...formatOrder(o),
        sellerLocation: seller?.address || null,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Unknown",
        sellerMobile: seller?.mobileNumber || null,
        buyerLocation: buyer?.address || null,
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Unknown",
        buyerMobile: buyer?.mobileNumber || null,
        logisticsName: logistics ? `${logistics.firstName} ${logistics.lastName}` : null,
        logisticsMobile: logistics?.mobileNumber || null,
      }
    });
    
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

/* GET ORDERS BY BUYER */
export const getOrdersByBuyer = async (req, res) => {
  try {
    const buyerAddress = req.user.walletAddress;
    const data = await orderManagerContract.getOrdersByBuyer(buyerAddress);
    const users = await User.findAll();
    
    const orders = data.map((o) => {
      const seller = users.find(
        u => u.walletAddress.toLowerCase() === o.sellerAddress.toLowerCase()
      );
      const buyer = users.find(
        u => u.walletAddress.toLowerCase() === o.buyerAddress.toLowerCase()
      );
      const logistics = users.find(
        u => u.walletAddress.toLowerCase() === o.logisticsAddress.toLowerCase()
      );
      
      return {
        ...formatOrder(o),
        sellerLocation: seller?.address || null,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Unknown",
        sellerMobile: seller?.mobileNumber || null,
        buyerLocation: buyer?.address || null,
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Unknown",
        buyerMobile: buyer?.mobileNumber || null,
        logisticsName: logistics ? `${logistics.firstName} ${logistics.lastName}` : null,
        logisticsMobile: logistics?.mobileNumber || null,
      }
    });
    
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getAvailableOrders = async (req, res) => {
  try {
    const data = await orderManagerContract.getAvailableOrders();
    const users = await User.findAll()

    const orders = data.map((o) => {
      const seller = users.find(
        u => u.walletAddress.toLowerCase() === o.sellerAddress.toLowerCase()
      );
      const buyer = users.find(
        u => u.walletAddress.toLowerCase() === o.buyerAddress.toLowerCase()
      );
      
      return {
        ...formatOrder(o),
        sellerLocation: seller?.address || null,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Unknown",
        sellerMobile: seller?.mobileNumber || null,
        buyerLocation: buyer?.address || null,
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Unknown",
        buyerMobile: buyer?.mobileNumber || null,
      }
    })
    
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const getAllOrders = async (req, res) => {
  try {
    const data = await orderManagerContract.getAllOrders();
    const users = await User.findAll();

    const orders = data.map((o) => {
      const seller = users.find(
        u => u.walletAddress.toLowerCase() === o.sellerAddress.toLowerCase()
      );
      const buyer = users.find(
        u => u.walletAddress.toLowerCase() === o.buyerAddress.toLowerCase()
      );
      const logistics = users.find(
        u => u.walletAddress.toLowerCase() === o.logisticsAddress.toLowerCase()
      );

      return {
        ...formatOrder(o),
        sellerLocation: seller?.address || null,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Unknown",
        sellerMobile: seller?.mobileNumber || null,
        buyerLocation: buyer?.address || null,
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Unknown",
        buyerMobile: buyer?.mobileNumber || null,
        logisticsName: logistics ? `${logistics.firstName} ${logistics.lastName}` : null,
        logisticsMobile: logistics?.mobileNumber || null,
      }
    });

    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getOrdersByLogistics = async(req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const data = await orderManagerContract.getOrdersByLogistics(logisticsAddress);
    const users = await User.findAll();
    
    const orders = data.map((o) => {
      const seller = users.find(
        u => u.walletAddress.toLowerCase() === o.sellerAddress.toLowerCase()
      );
      const buyer = users.find(
        u => u.walletAddress.toLowerCase() === o.buyerAddress.toLowerCase()
      );
      
      return {
        ...formatOrder(o),
        sellerLocation: seller?.address || null,
        sellerName: seller ? `${seller.firstName} ${seller.lastName}` : "Unknown",
        sellerMobile: seller?.mobileNumber || null,
        buyerLocation: buyer?.address || null,
        buyerName: buyer ? `${buyer.firstName} ${buyer.lastName}` : "Unknown",
        buyerMobile: buyer?.mobileNumber || null,
      }
    })
    
    console.log(orders)
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const acceptOrder = async (req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const { orderId } = req.body;
    const tx = await orderManagerContract.acceptOrder(orderId, logisticsAddress);
    await tx.wait();

    res.json({ message: "Delivery confirmed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const pickupOrder = async (req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const { orderId, location } = req.body;
    const tx = await orderManagerContract.pickupOrder(orderId, logisticsAddress, location);
    await tx.wait();

    res.json({ message: "Order picked up", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const markOutForDelivery = async (req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const { orderId } = req.body;
    const tx = await orderManagerContract.markOutForDelivery(orderId, logisticsAddress);
    await tx.wait();

    res.json({ message: "Marked out for delivery", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

/* CONFIRM DELIVERY */
export const confirmDelivery = async (req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const { orderId, location } = req.body;

    const tx = await orderManagerContract.confirmDeliveryByLogistics(orderId, location, logisticsAddress);
    await tx.wait();

    res.json({ message: "Delivery confirmed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

/* CONFIRM RECEIPT */
export const confirmReceipt = async (req, res) => {
  try {
    const { orderId } = req.body;
    const buyerAddress = req.user.walletAddress;

    const tx = await orderManagerContract.confirmReceipt(orderId, buyerAddress);
    await tx.wait();

    res.json({ message: "Order completed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getDisputedOrders = async (req, res) => {
  try {
    const users = await User.findAll();
    const allOrders = [];

    // Loop through all order IDs to find disputed ones
    // (since contract doesn't have a getDisputedOrders view function)
    const orderCount = Number(await orderManagerContract.orderCount());
    for (let i = 1; i <= orderCount; i++) {
      const o = await orderManagerContract.getOrderById(i);
      if (Number(o.status) === 7) { // 7 = Disputed
        const seller   = users.find(u => u.walletAddress?.toLowerCase() === o.sellerAddress?.toLowerCase());
        const buyer    = users.find(u => u.walletAddress?.toLowerCase() === o.buyerAddress?.toLowerCase());
        const logistics = users.find(u => u.walletAddress?.toLowerCase() === o.logisticsAddress?.toLowerCase());

        allOrders.push({
          ...formatOrder(o),
          sellerLocation:  seller?.address || null,
          sellerName:      seller  ? `${seller.firstName} ${seller.lastName}`  : "Unknown",
          sellerMobile:    seller?.mobileNumber || null,
          buyerLocation:   buyer?.address || null,
          buyerName:       buyer   ? `${buyer.firstName} ${buyer.lastName}`    : "Unknown",
          buyerMobile:     buyer?.mobileNumber || null,
          logisticsName:   logistics ? `${logistics.firstName} ${logistics.lastName}` : null,
          logisticsMobile: logistics?.mobileNumber || null,
        });
      }
    }

    res.json({ orders: allOrders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

/* OPEN DISPUTE */
export const openDispute = async (req, res) => {
  try {
    const senderAddress = req.user.walletAddress; // ← get from JWT, not body
    const { orderId } = req.body;

    const tx = await orderManagerContract.openDispute(orderId, senderAddress);
    await tx.wait();

    res.json({ message: "Dispute opened", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

/* RESOLVE DISPUTE */
export const resolveDispute = async (req, res) => {
  try {
    const { orderId, refundBuyer } = req.body;

    const tx = await orderManagerContract.resolveDispute(orderId, refundBuyer);
    await tx.wait();

    res.json({ message: "Dispute resolved", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const updateOrderLocation = async (req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const { orderId, location } = req.body;
    const orderLocation = await OrderLocation.findOne({ where: { orderId } });

    if (!orderLocation) return res.status(404).json({ error: "Order location not found" });

    orderLocation.latitude = location.latitude;
    orderLocation.longitude = location.longitude;
    await orderLocation.save();

    res.json({ message: "Order location updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const cancelOrderBySeller = async (req, res) => {
  try {  
    const sellerAddress = req.user.walletAddress;
    const { orderId } = req.body;
    const tx = await orderManagerContract.cancelOrderBySeller(orderId, sellerAddress);
    await tx.wait();
    
    res.json({ message: "Order cancelled", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const cancelOrderByBuyer = async (req, res) => {
  try {  
    const buyerAddress = req.user.walletAddress;  
    const { orderId } = req.body;
    const tx = await orderManagerContract.cancelOrderByBuyer(orderId, buyerAddress);
    await tx.wait();
    
    res.json({ message: "Order cancelled", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}