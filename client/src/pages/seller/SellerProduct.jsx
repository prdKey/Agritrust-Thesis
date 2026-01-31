import { useState, useEffect} from "react";
import { getProductsByUser, listProduct, updateProduct, deleteProduct} from "../../services/productService.js";
import SellerProductCard from "../../components/common/SellerProductCard";
import {uploadImageToPinata} from "../../services/uploadImgService.js"


export default function SellerProducts() {
  const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
            const data = await getProductsByUser();
            setProducts(data.products); // safe optional chaining
            } catch (err) {
            console.error("Failed to fetch products:", err);
            } 
        };
        fetchProducts();
        }, []);
  const [form, setForm] = useState({
    id: null,
    name: "",
    pricePerUnit: "",
    quantity: "",
    category: "",
    imageCID: "", // base64 or url
  });
  const [isEditing, setIsEditing] = useState(false);
  const [searchId, setSearchId] = useState(""); // New state for search

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    if (!form.name || !form.pricePerUnit || !form.quantity || !form.category) return;

    

    await listProduct({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        quantity: Number(form.quantity),
        
    })

    setProducts([
        ...products,
        {
            ...form,
            pricePerUnit: Number(form.pricePerUnit),
            quantity: Number(form.quantity),
        }
    ])
    console.log(products)

    resetForm();
  };

  const handleEdit = (product) => {
    setIsEditing(true);
    setForm(product);
  };

  const handleUpdate = async () => {
    await updateProduct({
        ...form,
        pricePerUnit: Number(form.pricePerUnit),
        quantity: Number(form.quantity),
        
    })
    setProducts(products.map((p) => (p.id === form.id ? form : p)));
    setIsEditing(false);
    resetForm();
  };

  const handleDelete = async (id) =>
  {
    await deleteProduct(id)
    setProducts(products.filter(product => product.id !== id))
  }

  const resetForm = () => {
    setForm({ id: null, name: "", pricePerUnit: "", quantity: "", category: "", imageCID: "" });
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const cid = await uploadImageToPinata(file)
      console.log("CID: " + cid)
      setForm({ ...form, [e.target.name]: cid });
    } catch (err) {
      console.error("Error uploading file:", err);
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
          name="quantity"
          type="number"
          value={form.quantity}
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
            className="flex-1 w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {form.imageCID && (
            <img
              src={form.imageCID}
              alt="Preview"
              className="mt-2 h-32 rounded object-cover"
            />
          )}
        </div>

        {!isEditing ? (
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 md:col-span-2"
          >
            Add Product
          </button>
        ) : (
          <>
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 md:col-span-2"
            >
              Update Product
            </button>

            <button
              onClick={() => {
                setIsEditing(false);
                resetForm();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-500 md:col-span-2"
            >
              Cancel
            </button>
          </>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
            <SellerProductCard product={product} handleEdit={handleEdit} handleDelete={handleDelete}/>
        ))}
        </div>
    </div>
  );
}
