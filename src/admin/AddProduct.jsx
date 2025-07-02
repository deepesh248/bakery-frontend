import { useState } from "react";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

function AddProduct() {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  const [detail, setDetail] = useState({
    eggless: false,
    ingredients: "",
    description: "",
    weight: "",
  });

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetail({
      ...detail,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const productRes = await api.post("/products", product);
      const productId = productRes.data.id;

      
      await api.post(`/product-details/${productId}`, detail);

      toast.success("Product and details added successfully!");
      
    
      setProduct({
        name: "",
        description: "",
        price: "",
        quantity: "",
        imageUrl: "",
      });
      setDetail({
        eggless: false,
        ingredients: "",
        description: "",
        weight: "",
      });

    } catch (err) {
      console.error("Error adding product or detail", err);
      toast.error("Failed to add product. Check console for details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 bg-white rounded-lg shadow-md">
      <Toaster />
      <h2 className="text-2xl text-pink-600 font-bold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Product Info */}
        <input
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleProductChange}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Short Description"
          value={product.description}
          onChange={handleProductChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={product.price}
          onChange={handleProductChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={product.quantity}
          onChange={handleProductChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          name="imageUrl"
          placeholder="Image URL"
          value={product.imageUrl}
          onChange={handleProductChange}
          className="w-full p-2 border rounded"
          required
        />

        <hr className="my-4" />

        {/* Product Detail Info */}
        <h3 className="text-lg font-semibold text-pink-500">More Cake Details</h3>

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="eggless"
            checked={detail.eggless}
            onChange={handleDetailChange}
          />
          <span>Eggless</span>
        </label>

        <textarea
          name="ingredients"
          placeholder="Ingredients"
          value={detail.ingredients}
          onChange={handleDetailChange}
          className="w-full p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Full Description"
          value={detail.description}
          onChange={handleDetailChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="weight"
          placeholder="Weight (e.g. 500g, 1kg)"
          value={detail.weight}
          onChange={handleDetailChange}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-2 rounded hover:bg-pink-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}

export default AddProduct;
