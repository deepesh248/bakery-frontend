import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Order Placed Successfully! 🎉</h1>
      <p className="text-lg text-gray-700 mb-6">Thank you for shopping with us.</p>
      <Link
        to="/products"
        className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition"
      >
        Back to Products
      </Link>
    </div>
  );
}

export default OrderSuccess;
