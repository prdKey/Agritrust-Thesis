import React from 'react'

export default function SellerProductCard({product, handleEdit, handleDelete}) {
  return (
    <div className="p-4 bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
        <img
            src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${product.imageCID}` }
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-2"
        />

        <h2 className="font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-500">ID: {product.id}</p>
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="mt-1">₱{product.pricePerUnit}</p>
        <p className="text-sm">Stock: {product.quantity}</p>

        <div className="flex gap-3 mt-2">
            <button
            onClick={() => handleEdit(product)}
            className="text-blue-600 hover:underline"
            >
            Edit
            </button>

            <button
            onClick={ () => handleDelete(product.id)}
            className="text-red-600 hover:underline"
            >
            Delete
            </button>
        </div>
    </div>
  )
}
