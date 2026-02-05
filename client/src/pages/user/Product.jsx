import ProductDetailCard from "../../components/common/ProductDetailCard.jsx"
import ReviewCard from "../../components/common/ReviewCard.jsx"
import EmptyState  from "../../components/common/EmptyState.jsx";
import {getProductById} from "../../services/productService.js"
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import Loader from "../../components/common/Loader.jsx";

export const sampleReviews = [
  {
    user: "j****1",
    rating: 5,
    date: "2024-08-15 16:05",
    variant: "X6 White",
    feature: "Light weight and its functions",
    comment:
      "Very good buy. Super gaan din. Masarap lang sa kamay. Multifunction mouse. Easy to use. Clear ang manual. Very happy with this purchase. Also cool to connect your mouse sa cellphone and play.",
    media: [
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7",
      "https://images.unsplash.com/photo-1615663245843-48f9b4c4c5cc",
    ],
    likes: 46,
  },
  {
    user: "m*****s",
    rating: 5,
    date: "2024-02-04 16:49",
    variant: "X6 Black",
    feature: "Tri-mode + dock",
    comment:
      "Delivery service was superb. Was shipped and delivered immediately. The best yung tri-mode and the dock. Used it for Valorant, performance is decent. Charging dock is very convenient.",
    media: [],
    likes: 29,
  },
  {
    user: "a***n",
    rating: 4,
    date: "2024-01-18 11:22",
    variant: "X6 White",
    feature: "Design",
    comment:
      "Magaan and comfortable gamitin. Buttons are responsive. Medyo mabilis lang maubos battery but overall okay for the price.",
    media: [
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04",
    ],
    likes: 12,
  },
  {
    user: "r***y",
    rating: 3,
    date: "2023-12-02 09:10",
    variant: "X6 Black",
    feature: "",
    comment:
      "Okay naman siya. Works as advertised pero nothing special. Pwede na for daily office use.",
    media: [],
    likes: 5,
  },
  {
    user: "k***e",
    rating: 1,
    date: "2023-11-20 14:33",
    variant: "X6 White",
    feature: "None",
    comment:
      "Received a defective unit. Mouse was not charging properly. Requested for return/refund.",
    media: [],
    likes: 3,
  },
];


export default function Product() {
    const [product, setProduct] = useState([]);
    const { id } = useParams();
    const [loading, setloading] = useState(false);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setloading(true);
                const data = await getProductById(id);
                console.log(data)
                setProduct(data.product); // safe optional chaining
            } catch (err) {
                console.error("Failed to fetch products:", err);
            } finally {
                setloading(false)
            }
    };
        fetchProduct();
    }, [id]);

    

  return (
    <div className="m-5">
        {loading ? (
            <Loader css="h-130" />
        ) : product?.id ? (
            <>
            <ProductDetailCard product={product} />
            <ReviewCard reviews={sampleReviews} />
            </>
        ) : (
            <EmptyState
            title="Product not found"
            actionLabel="Go Back"
            navigateTo={"/"}
            />
        )}
    </div>


    
  )
}
