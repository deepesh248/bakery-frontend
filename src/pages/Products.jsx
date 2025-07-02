import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast, { Toaster } from "react-hot-toast";

function Products() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

 
  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        setProducts(res.data);
        const qtyMap = {};
        res.data.forEach((p) => (qtyMap[p.id] = 1)); 
        setQuantities(qtyMap);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);


  const handleQuantityChange = (id, value) => {
    const val = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [id]: val }));
  };


  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to add items");
      return;
    }

    const quantity = parseInt(quantities[product.id]) || 1;

    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} left in stock`);
      return;
    }

    
    const payload = {
      user: { id: user.id },
      product: { id: product.id },
      quantity: quantity,
    };

    console.log("Quantity to add:", quantity); 
    console.log("Product:", product.name); 

    api
      .post("/cart/add", payload)
      .then(() => toast.success(`Added ${quantity} to cart!`)) 
      .catch((err) => {
        console.error("Add to cart error:", err);
        toast.error("Something went wrong!");
      });
  };


  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  return (
    <div className="px-4 py-8">
      <Toaster position="top-right" reverseOrder={false} />
      <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
        Our Bakery Products
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 relative">
              {product.quantity < 5 && product.quantity > 0 && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded">
                  Low Stock
                </span>
              )}

              {product.quantity === 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}

              <h3 className="text-xl font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {product.description}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                In stock: {product.quantity}
              </p>

              <div className="flex items-center gap-2 mt-4">
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  disabled={product.quantity === 0}
                  value={quantities[product.id] || 1}
                  onClick={(e) => e.stopPropagation()} 
                  onChange={(e) =>
                    handleQuantityChange(product.id, e.target.value)
                  }
                  className="w-16 border rounded px-2 py-1 text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                />

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToCart(product);
                  }}
                  className={`px-3 py-1 text-sm rounded text-white ${
                    product.quantity === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-pink-500 hover:bg-pink-600"
                  }`}
                  disabled={product.quantity === 0}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
