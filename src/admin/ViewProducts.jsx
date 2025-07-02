import { useEffect, useState } from "react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";


function ViewProducts() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      console.log("Response from backend:", res.data);
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Toaster />
      <h2 className="text-2xl font-bold text-pink-600 mb-4">All Products</h2>

      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-pink-100">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Qty</th>
              <th className="p-2 border">Image URL</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2 border">
                  <img
                    src={p.imageUrl}
                    className="w-16 h-16 object-cover"
                    alt={p.name}
                  />
                </td>
                <td className="p-2 border">{p.name}</td>
                <td className="p-2 border">{p.description}</td>
                <td className="p-2 border">₹{p.price}</td>
                <td className="p-2 border">{p.quantity}</td>
                <td className="p-2 border break-words">{p.imageUrl}</td>
                <td className="p-2 border">
                  <Link
                    to={`/admin/edit-product/${p.id}`}
                    className="bg-yellow-500 text-white px-3 py-1 mr-2 rounded inline-block text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewProducts;
