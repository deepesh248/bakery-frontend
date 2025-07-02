import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ProductDetailWithReviews from "./pages/ProductDetailWithReviews";
import Footer from "./components/Footer";
import AdminDashboard from "./admin/AdminDashboard";
import AddProduct from "./admin/AddProduct";
import ViewProducts from "./admin/ViewProducts";
import UpdateProduct from "./admin/UpdateProduct";

function App() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/products/:id" element={<ProductDetailWithReviews />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/view-products" element={<ViewProducts />} />
        <Route path="/admin/edit-product/:id" element={<UpdateProduct />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
