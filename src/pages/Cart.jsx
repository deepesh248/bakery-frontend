import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // ✅ make sure this is your axios instance

function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    getTotal,
  } = useCart();

  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    const q = {};
    cartItems.forEach((item) => {
      q[item.id] = item.quantity;
    });
    setQuantities(q);
  }, [cartItems]);

  const handleQuantityChange = (item, value) => {
    const qty = Math.max(1, parseInt(value) || 1);
    if (qty > item.product.quantity) {
      toast.error(`Only ${item.product.quantity} in stock`);
      return;
    }

    setQuantities((prev) => ({ ...prev, [item.id]: qty }));
    addItemToCart(item, qty);
  };

  const handleRemove = (itemId) => {
    removeItemFromCart(itemId);
  };

  const handleCheckout = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please log in to place an order.");
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Cart is empty.");
      return;
    }

    const orderPayload = {
      userId: user.id,
      shippingAddress: "123 Cake Street",
      totalAmount: parseFloat(getTotal()),
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: quantities[item.id] || item.quantity,
      })),
    };

    try {
      const res = await api.post("/orders", orderPayload); // ✅ using axios instance

      if (res.status === 200 || res.status === 201) {
        navigate("/checkout");
      } else {
        toast.error("Order failed.");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="px-4 py-8">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        My Cart
      </h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white shadow-md rounded-lg overflow-hidden p-4"
            >
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold">{item.product.name}</h3>
                <p className="text-sm text-gray-600">
                  {item.product.description}
                </p>
                <p className="text-sm text-gray-500">
                  Price: ₹{item.product.price}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max={item.product.quantity}
                    value={quantities[item.id] || item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item, e.target.value)
                    }
                    className="w-16 border rounded px-2 py-1 text-sm"
                  />
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="text-right mt-6">
            <h4 className="text-xl font-bold">Total: ₹{getTotal()}</h4>
            <button
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
