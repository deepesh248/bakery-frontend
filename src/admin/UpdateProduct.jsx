import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    imageUrl: "",
  });

  const [details, setDetails] = useState({
    eggless: false,
    ingredients: "",
    description: "",
    weight: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);

        const detailRes = await api.get(`/product-details/${id}`);
        setDetails(detailRes.data);
      } catch (err) {
        toast.error("Error loading product data");
      }
    };

    fetchProduct();
  }, [id]);

  const handleProductChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleDetailChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDetails({ ...details, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/products/${id}`, product);
      await api.post(`/product-details/${id}`, details);
      toast.success("Product updated successfully!");
      setTimeout(() => navigate("/admin/view-products"), 1000);
    } catch (err) {
      toast.error("Error updating product");
      console.error(err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <Toaster />
      <h2 className="text-2xl font-bold text-pink-600 mb-4">Update Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={product.name}
          onChange={handleProductChange}
          placeholder="Name"
          className="w-full p-2 border mb-3"
        />
        <input
          name="description"
          value={product.description}
          onChange={handleProductChange}
          placeholder="Short Description"
          className="w-full p-2 border mb-3"
        />
        <input
          name="price"
          value={product.price}
          onChange={handleProductChange}
          placeholder="Price"
          type="number"
          className="w-full p-2 border mb-3"
        />
        <input
          name="quantity"
          value={product.quantity}
          onChange={handleProductChange}
          placeholder="Quantity"
          type="number"
          className="w-full p-2 border mb-3"
        />
        <input
          name="imageUrl"
          value={product.imageUrl}
          onChange={handleProductChange}
          placeholder="Image URL"
          className="w-full p-2 border mb-3"
        />

        <textarea
          name="description"
          value={details.description}
          onChange={handleDetailChange}
          placeholder="Detailed Description"
          className="w-full p-2 border mb-3"
        />
        <input
          name="ingredients"
          value={details.ingredients}
          onChange={handleDetailChange}
          placeholder="Ingredients"
          className="w-full p-2 border mb-3"
        />
        <input
          name="weight"
          value={details.weight}
          onChange={handleDetailChange}
          placeholder="Weight (e.g., 500g)"
          className="w-full p-2 border mb-3"
        />

        <label className="block mb-3">
          <input
            type="checkbox"
            name="eggless"
            checked={details.eggless}
            onChange={handleDetailChange}
            className="mr-2"
          />
          Eggless
        </label>

        <button className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default UpdateProduct;
