import { Link } from "react-router-dom";

function AdminDashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-pink-700">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/add-product"
          className="bg-pink-500 text-white p-4 rounded shadow hover:bg-pink-600"
        >
          Add Product
        </Link>
        <Link
          to="/admin/view-products"
          className="bg-pink-500 text-white p-4 rounded shadow hover:bg-pink-600"
        >
          View Products
        </Link>
        
      </div>
    </div>
  );
}
export default AdminDashboard;
