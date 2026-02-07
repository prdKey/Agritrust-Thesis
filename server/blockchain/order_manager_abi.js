export const ORDER_MANAGER_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "logisticsAddress",
				"type": "address"
			}
		],
		"name": "acceptOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "buyerAddress",
				"type": "address"
			}
		],
		"name": "buyProduct",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "logisticsAddress",
				"type": "address"
			}
		],
		"name": "confirmDeliveryByLogistics",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "buyerAddress",
				"type": "address"
			}
		],
		"name": "confirmReceipt",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "sellerAddress",
				"type": "address"
			}
		],
		"name": "confirmShipment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_agtToken",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "_productManager",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "InactiveProduct",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InsufficientStock",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidOrderState",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "InvalidQuantity",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotAuthorized",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotBuyer",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotDisputed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "NotSeller",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "senderAddress",
				"type": "address"
			}
		],
		"name": "openDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "OwnableInvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "account",
				"type": "address"
			}
		],
		"name": "OwnableUnauthorizedAccount",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "PaymentFailed",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "LogisticsUpdated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "logistics",
				"type": "address"
			}
		],
		"name": "OrderAssignedToLogistics",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderCompleted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "OrderCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderDelivered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderDisputed",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "address",
				"name": "logistics",
				"type": "address"
			}
		],
		"name": "OrderPickedUp",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderRefunded",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			}
		],
		"name": "OrderShipped",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "logisticsAddress",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"name": "pickupOrder",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "renounceOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "orderId",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "refundBuyer",
				"type": "bool"
			}
		],
		"name": "resolveDispute",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "agtToken",
		"outputs": [
			{
				"internalType": "contract AGTToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "buyerOrders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getAvailableOrders",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "buyerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "sellerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "logisticsAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerUnit",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "category",
						"type": "string"
					},
					{
						"internalType": "enum OrderManager.OrderStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct OrderManager.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "buyer",
				"type": "address"
			}
		],
		"name": "getOrdersByBuyer",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "buyerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "sellerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "logisticsAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerUnit",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "category",
						"type": "string"
					},
					{
						"internalType": "enum OrderManager.OrderStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct OrderManager.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "logistics",
				"type": "address"
			}
		],
		"name": "getOrdersByLogistics",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "buyerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "sellerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "logisticsAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerUnit",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "category",
						"type": "string"
					},
					{
						"internalType": "enum OrderManager.OrderStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct OrderManager.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "seller",
				"type": "address"
			}
		],
		"name": "getOrdersBySeller",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "id",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "productId",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "buyerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "sellerAddress",
						"type": "address"
					},
					{
						"internalType": "address",
						"name": "logisticsAddress",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "quantity",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "totalPrice",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "pricePerUnit",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "name",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "category",
						"type": "string"
					},
					{
						"internalType": "enum OrderManager.OrderStatus",
						"name": "status",
						"type": "uint8"
					}
				],
				"internalType": "struct OrderManager.Order[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "orderCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orderLogistics",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "status",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "location",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "orders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "productId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "buyerAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "sellerAddress",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "logisticsAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "quantity",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "totalPrice",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "pricePerUnit",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "category",
				"type": "string"
			},
			{
				"internalType": "enum OrderManager.OrderStatus",
				"name": "status",
				"type": "uint8"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "productManager",
		"outputs": [
			{
				"internalType": "contract ProductManager",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "sellerOrders",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]