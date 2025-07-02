import { useEffect } from "react";
import { motion } from "framer-motion";
import cakeImage from "../assets/Strawberry-Cake-6-1024x1536.webp";
import cake1 from "../assets/Chocolate-Velvet-Cake.jpg";
import cake2 from "../assets/free-photo-of-cake-with-fruits.jpeg";
import cake3 from "../assets/pexels-photo-1291712.jpeg";
import cake4 from "../assets/pexels-photo-1721934.jpg";
import cake5 from "../assets/pexels-photo-7186055.jpeg";

function Home() {
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-pink-50 overflow-hidden">
      {/* Hero Section */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">
        <motion.div
          className="md:w-1/2 text-center md:text-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {user && (
            <p className="text-sm text-gray-600 mb-2">Welcome back, {user.name}!</p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 animate-bounce">
            Freshly Baked Happiness
          </h1>
          <p className="text-gray-700 text-lg mb-6">
            Discover our delightful selection of cakes, cookies, and pastries – made with love every day.
          </p>
          <motion.a
            href="/products"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-6 py-3 bg-pink-600 text-white rounded-full shadow-md hover:bg-pink-700 transition"
          >
            Shop Now
          </motion.a>
        </motion.div>

        <motion.div
          className="md:w-1/2 mt-10 md:mt-0"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src={cakeImage}
            alt="Delicious Cake"
            className="w-full max-w-md rounded-lg shadow-lg mx-auto"
          />
        </motion.div>
      </div>

      {/* About Bakery Section */}
      <motion.div
        className="bg-white py-12 px-6 md:px-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 mb-10 animate-pulse">Why Choose Our Bakery?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-gray-700">
            <p>📍 <strong>Location:</strong> Based in Bilaspur, delivering fresh bakes city-wide.</p>
            <p>🍰 <strong>Quality:</strong> We use only the best ingredients, baked fresh daily.</p>
            <p>👨‍🍳 <strong>Expertise:</strong> Handmade with passion by experienced chefs.</p>
            <p>🌟 <strong>Popularity:</strong> Rated #1 by over 10,000 happy customers.</p>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {[cake1, cake2, cake3, cake4].map((img, idx) => (
              <motion.img
                key={idx}
                src={img}
                alt={`About ${idx + 1}`}
                className="w-32 h-32 object-cover rounded-full shadow"
                whileHover={{ scale: 1.1 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Auto-sliding Cake Gallery */}
<div className="bg-pink-100 py-10 overflow-hidden">
  <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">A Glimpse of Sweetness</h2>
  <div className="w-full overflow-hidden relative">
    <div className="flex animate-slide gap-4 w-max">
      {[cake1, cake2, cake3, cake4, cake5, cake1, cake2, cake3, cake4, cake5].map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`Cake ${idx + 1}`}
          className="w-64 h-40 object-cover rounded-xl shadow-md flex-shrink-0"
        />
      ))}
    </div>
  </div>
</div>
c

      {/* Product CTA Section */}
      <motion.div
        className="text-center py-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold text-pink-700 mb-4">Hungry for More?</h2>
        <a
          href="/products"
          className="inline-block px-8 py-3 bg-pink-600 text-white text-lg rounded-full hover:bg-pink-700 transition transform hover:scale-105"
        >
          Browse All Products
        </a>
      </motion.div>
    </div>
  );
}

export default Home;
