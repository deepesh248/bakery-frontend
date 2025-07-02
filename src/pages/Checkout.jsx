import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useCart } from "../context/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const { cartItems, getTotal, clearCart } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [userId, setUserId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [newAddress, setNewAddress] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    } else {
      toast.error("Please log in first.");
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      api
        .get(`/addresses/${userId}`)
        .then((res) => {
          setAddresses(res.data || []);
        })
        .catch((err) => {
          console.error("Failed to fetch addresses", err);
        });
    }
  }, [userId]);

  const handleAddNewAddress = async () => {
    const { name, phoneNumber, street, city, state, postalCode, country } =
      newAddress;

    if (
      !name ||
      !phoneNumber ||
      !street ||
      !city ||
      !state ||
      !postalCode ||
      !country
    ) {
      toast.error("Please fill out all address fields.");
      return;
    }

    try {
      const response = await api.post(`/addresses/${userId}`, newAddress);
      if (response.data) {
        toast.success("Address added successfully.");
        const updatedAddresses = [...addresses, response.data];
        setAddresses(updatedAddresses);
        // ✅ Convert to string so it matches <select> option
        setSelectedAddressId(String(response.data.id));
        setNewAddress({
          name: "",
          phoneNumber: "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        });
      }
    } catch (error) {
      console.error("Failed to add address", error);
      toast.error("Failed to add address. Please try again.");
    }
  };

  const handleOrderSubmit = async () => {
    const selectedAddressObj = addresses.find(
      (addr) => String(addr.id) === selectedAddressId
    );

    const shippingAddress = selectedAddressObj
      ? `${selectedAddressObj.street}, ${selectedAddressObj.city}, ${selectedAddressObj.state}, ${selectedAddressObj.country} - ${selectedAddressObj.postalCode}`
      : "";

    const totalAmount = getTotal();

    if (!shippingAddress) {
      toast.error("Please select a shipping address.");
      return;
    }

    if (!userId || cartItems.length === 0) {
      toast.error("Cannot place order. Cart is empty or user not logged in.");
      return;
    }

    const orderDetails = {
      userId,
      totalAmount,
      shippingAddress,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    try {
      setIsSubmitting(true);
      await api.post("/orders", orderDetails);
      clearCart();
      navigate("/order-success");
    } catch (err) {
      console.error("Order Error:", err);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 py-8">
      <Toaster position="top-right" />
      <h2 className="text-3xl font-bold text-pink-600 mb-6 text-center">
        Checkout
      </h2>

      <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow-md">
        {/* Address Selection */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Select Address</h3>
          <select
            className="w-full p-2 border rounded-md mt-2"
            value={selectedAddressId}
            onChange={(e) => setSelectedAddressId(e.target.value)}
          >
            <option value="">Choose an address</option>
            {addresses.length === 0 ? (
              <option disabled>No addresses found</option>
            ) : (
              addresses.map((addr) => (
                <option key={addr.id} value={String(addr.id)}>
                  {`${addr.name || "Name Missing"} (${addr.phoneNumber || "No Phone"}) - ${addr.street}, ${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}`}
                </option>
              ))
            )}
          </select>
        </div>

        {/* New Address Form */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Add a New Address</h3>
          {[
            { label: "Full Name", name: "name", placeholder: "John Doe" },
            { label: "Phone Number", name: "phoneNumber", placeholder: "1234567890" },
            { label: "Street", name: "street", placeholder: "123 Main St" },
            { label: "City", name: "city", placeholder: "City" },
            { label: "State", name: "state", placeholder: "State" },
            { label: "Postal Code", name: "postalCode", placeholder: "000000" },
            { label: "Country", name: "country", placeholder: "Country" },
          ].map(({ label, name, placeholder }) => (
            <div key={name} className="mb-3">
              <label className="block text-sm font-medium text-gray-700">{label}</label>
              <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={newAddress[name]}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, [name]: e.target.value })
                }
                className="w-full p-2 border rounded-md mt-1"
              />
            </div>
          ))}

          <button
            className="w-full py-2 bg-blue-500 text-white rounded-md mt-2"
            onClick={handleAddNewAddress}
          >
            Add New Address
          </button>
        </div>

        {/* Cart Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
          <div className="space-y-4 mt-4">
            {cartItems.map((item, index) => {
              if (!item.product) return null;
              return (
                <div key={item.product.id || index} className="flex justify-between">
                  <p className="text-gray-700">{item.product.name}</p>
                  <p className="text-gray-700">
                    ₹{item.product.price} x {item.quantity}
                  </p>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-right">
            <h4 className="text-xl font-bold">Total: ₹{getTotal()}</h4>
          </div>
        </div>

        {/* Confirm Order */}
        <div className="flex justify-end">
          <button
            onClick={handleOrderSubmit}
            className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Placing Order..." : "Confirm Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
