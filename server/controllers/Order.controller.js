import { orderManagerContract } from "../blockchain/contract.js"

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

/* GET ORDERS BY SELLER */
export const getOrdersBySeller = async (req, res) => {
  try {
    const sellerAddress = req.user.walletAddress;
    const data = await orderManagerContract.getOrdersBySeller(sellerAddress);
    const orders = data.map((o) => (
      {
        id: Number(o.id),
        productId: Number(o.productId),
        buyerAddress: o.buyerAddress,
        sellerAddress: o.sellerAddress,
        logisticsAddress: o.logisticsAddress,
        quantity: Number(o.quantity),
        totalPrice: Number(o.totalPrice),
        pricePerUnit: Number(o.pricePerUnit),
        name: o.name,
        category: o.category,
        status: Number(o.status)
      }
    ))
 
    res.json({orders});
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
    const orders = data.map((o) => (
      {
        id: Number(o.id),
        productId: Number(o.productId),
        buyerAddress: o.buyerAddress,
        sellerAddress: o.sellerAddress,
        logisticsAddress: o.logisticsAddress,
        quantity: Number(o.quantity),
        totalPrice: Number(o.totalPrice),
        pricePerUnit: Number(o.pricePerUnit),
        name: o.name,
        category: o.category,
        status: Number(o.status)
      }
    ))
    res.json({orders});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

export const getAvailableOrders = async (req, res) =>
{
  try{
    const logisticsAddress = req.user.walletAddress;
    const data = await orderManagerContract.getAvailableOrders();
     const orders = data.map((o) => (
      {
        id: Number(o.id),
        productId: Number(o.productId),
        buyerAddress: o.buyerAddress,
        sellerAddress: o.sellerAddress,
        logisticsAddress: o.logisticsAddress,
        quantity: Number(o.quantity),
        totalPrice: Number(o.totalPrice),
        pricePerUnit: Number(o.pricePerUnit),
        name: o.name,
        category: o.category,
        status: Number(o.status)
      }
    ))
    res.json({orders});

  }catch(err){
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const getOrdersByLogistics = async(req, res) =>
{
  try{
    const logisticsAddress = req.user.walletAddress;
    const data = await orderManagerContract.getOrdersByLogistics(logisticsAddress);
     const orders = data.map((o) => (
      {
        id: Number(o.id),
        productId: Number(o.productId),
        buyerAddress: o.buyerAddress,
        sellerAddress: o.sellerAddress,
        logisticsAddress: o.logisticsAddress,
        quantity: Number(o.quantity),
        totalPrice: Number(o.totalPrice),
        pricePerUnit: Number(o.pricePerUnit),
        name: o.name,
        category: o.category,
        status: Number(o.status)
      }
    ))
    res.json({orders});

  }catch(err){
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const acceptOrder = async (req, res) =>
{
  try{
    const logisticsAddress = req.user.walletAddress;
    const {orderId} = req.body;
    const tx = await orderManagerContract.acceptOrder(orderId, logisticsAddress);
    await tx.wait();

    res.json({ message: "Delivery confirmed", txHash: tx.hash });
  } catch (err){
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

export const pickupOrder = async (req, res) =>
{
  try{
    const logisticsAddress = req.user.walletAddress;
    const {orderId, location} = req.body;
    const tx = await orderManagerContract.pickupOrder(orderId, logisticsAddress, location);
    await tx.wait();

    res.json({ message: "Delivery confirmed", txHash: tx.hash });
  } catch (err){
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
}

/* CONFIRM DELIVERY */
export const confirmDelivery = async (req, res) => {
  try {
    const logisticsAddress = req.user.walletAddress;
    const { orderId, location} = req.body;

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
    const logisticsAddress = req.user.walletAddress;

    const tx = await orderManagerContract.confirmReceipt(orderId, logisticsAddress);
    await tx.wait();

    res.json({ message: "Order completed", txHash: tx.hash });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.reason || err.message });
  }
};

/* OPEN DISPUTE */
export const openDispute = async (req, res) => {
  try {
    const { orderId, senderAddress } = req.body;

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

