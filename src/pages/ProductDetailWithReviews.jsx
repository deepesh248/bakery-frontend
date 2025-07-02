import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

const ProductDetailWithReviews = () => {
  const { id: productDetailId } = useParams();

  const [productDetail, setProductDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [user, setUser] = useState(null);
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    if (productDetailId) fetchProductDetail();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [productDetailId]);

  const fetchProductDetail = async () => {
    try {
      const [productRes, detailRes] = await Promise.all([
        axios.get(`/products/${productDetailId}`),
        axios.get(`/product-details/${productDetailId}`)
      ]);

      const mergedData = {
        product: productRes.data,
        description: detailRes.data.description,
        weight: detailRes.data.weight,
        ingredients: detailRes.data.ingredients,
        eggless: detailRes.data.eggless,
        reviews: detailRes.data.reviews,
      };

      setProductDetail(mergedData);
      setQuantities({ [productRes.data.id]: 1 });
    } catch (err) {
      console.error("Failed to fetch product and detail", err);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to submit a review");

    try {
      await axios.post(
        `/product-details/${productDetailId}/reviews`,
        {
          userName: user.name,
          comment,
          rating,
        },
        { withCredentials: true }
      );
      setComment("");
      setRating(5);
      fetchProductDetail();
    } catch (err) {
      console.error("Failed to submit review", err);
    }
  };

  const handleAddToCart = (product) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      toast.error("Please login to add items");
      return;
    }

    const quantity = quantities[product.id] || 1;

    if (quantity > product.quantity) {
      toast.error(`Only ${product.quantity} left in stock`);
      return;
    }

    const payload = {
      user: { id: user.id },
      product: { id: product.id },
      quantity: quantity,
    };

    axios
      .post("/cart/add", payload)
      .then(() => toast.success("Added to cart!"))
      .catch((err) => {
        console.error("Add to cart error:", err);
        toast.error("Something went wrong!");
      });
  };

  const handleQuantityChange = (id, value) => {
    const val = Math.max(1, parseInt(value) || 1);
    setQuantities((prev) => ({ ...prev, [id]: val }));
  };

  if (!productDetail) return <p className="text-center">Loading...</p>;

  const product = productDetail?.product || {};
  const description = productDetail?.description || "";
  const weight = productDetail?.weight || "";
  const ingredients = productDetail?.ingredients || "";
  const eggless = productDetail?.eggless || false;
  const reviews = productDetail?.reviews || [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded-xl my-5">
      {/* Product Info */}
      <div className="flex flex-col md:flex-row gap-6">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full md:w-64 rounded-lg"
          />
        )}
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-gray-600">{description}</p>
          <p className="mt-2 text-lg font-semibold">₹{product.price}</p>
          <p className="mt-1 text-sm text-gray-500">
            Quantity: {product.quantity}
          </p>
          <p className="mt-1 text-sm text-gray-500">Weight: {weight}</p>
          <p className="mt-1 text-sm text-gray-500">
            Eggless: {eggless ? "Yes" : "No"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Ingredients: {ingredients}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4">
        <input
          type="number"
          min="1"
          max={product.quantity}
          disabled={product.quantity === 0}
          value={quantities[product.id] || 1}
          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
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

      {/* Review Form */}
      {user ? (
        <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3">
          <h3 className="text-xl font-semibold">Leave a Review</h3>
          <p className="text-gray-700">
            Reviewing as <strong>{user.name}</strong>
          </p>
          <textarea
            placeholder="Your comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            rows="3"
            required
          />
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full border px-3 py-2 rounded"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Stars
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="mt-4 text-red-500">Login to leave a review.</p>
      )}

      {/* Reviews */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-3">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-gray-100 p-3 rounded mb-2">
              <div className="flex justify-between">
                <span className="font-bold">
                  {review.userName || "Anonymous"}
                </span>
                <span className="text-yellow-500">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>
              <p className="text-gray-700 mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductDetailWithReviews;
