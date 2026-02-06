import { useState, useEffect} from "react";
import { getProductsByUser, listProduct, updateProduct, deleteProduct} from "../../services/productService.js";
import SellerProductCard from "../../components/common/SellerProductCard";
import {uploadImageToPinata} from "../../services/uploadImgService.js"
import { useUserContext } from "../../context/UserContext.jsx";
import Notification from "../../components/common/Notification.jsx";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setloading] = useState(false)
  const {user} = useUserContext();

    useEffect(() => {
        if (!user) return;
        
        const fetchProducts = async () => {
            try {
            const data = await getProductsByUser(user.id);
            setProducts(data.products); // safe optional chaining
            } catch (err) {
            console.error("Failed to fetch products:", err);
            } 
        };
        fetchProducts();
        }, [user]);

  const [notifications, setNotifications] = useState([]);

  const addNotification = (msg, type) => {
    const id = Date.now();
    setNotifications([...notifications, { id, message: msg, type }]);
  };

  const removeNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };
  
  const [form, setForm] = useState({
    id: null,
    name: "",
    pricePerUnit: "",
    stock: "",
    category: "",
    imageCID: "", // base64 or url
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchId, setSearchId] = useState(""); // New state for search

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.pricePerUnit || !form.stock || !form.category) return;
    setloading(true);
    const data = await listProduct({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        stock: Number(form.stock),
        
    })
    setProducts(data.products)
    addNotification(`Product "${form.name}" added successfully!`, "success");
    resetForm();
    setloading(false);
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setForm(product);
  };

  const handleUpdate = async () => {
    if (!form.name || !form.pricePerUnit || !form.stock || !form.category) return;
    setloading(true);
    const data = await updateProduct({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        stock: Number(form.stock),
        
    })
    setProducts(data.products);
    setloading(false)
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = async (id) =>
  {
    const data = await deleteProduct(id)
    setProducts(data.products)
    setIsEditing(false);
    resetForm();
  }

  const resetForm = () => {
    setForm({ id: null, name: "", pricePerUnit: "", stock: "", category: "", imageCID: "" });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setloading(true)
      const cid = await uploadImageToPinata(file)
      console.log("CID: " + cid)
      setForm({ ...form, [e.target.name]: cid });
    } catch (err) {
      console.error("Error uploading file:", err);
    } finally{
      setloading(false)
    }
  };

  // Filtered products by search ID
  const filteredProducts = searchId
    ? products.filter((p) => p.id === Number(searchId))
    : products;

  return (
    <div className="min-h-screen rounded-lg bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Seller Products</h1>

      {/* Search by ID */}
      <div className="mb-4">
        <input
          type="number"
          placeholder="Search by Product ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          className="flex-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      {/* Form */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option value="">All</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Grains">Grains</option>
          <option value="Dairy">Dairy</option>
        </select>
        <input
          name="pricePerUnit"
          type="number"
          value={form.pricePerUnit}
          onChange={handleChange}
          placeholder="Price"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <input
          name="stock"
          type="number"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <div className="md:col-span-2">
          <input
            name="imageCID"
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="flex-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
          />
          {form.imageCID && (
            <img
              src={`https://bronze-magnificent-constrictor-556.mypinata.cloud/ipfs/${form.imageCID}`}
              alt="Preview"
              className="mt-2 h-32 rounded object-cover"
            />
          )}
        </div>

        {!isEditing ? (
          <button
            onClick={handleAdd}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2 cursor-pointer"
          >
            Add Product
          </button>
        ) : (
          <>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2 cursor-pointer"
            >
              Update Product
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-500 md:col-span-2 cursor-pointer"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredProducts.map((product) => (
            <SellerProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))}
      </div>

      {/* Notifications container */}
      {notifications.map((n) => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onClose={() => removeNotification(n.id)}
        />
      ))}

    </div>
  );
}
