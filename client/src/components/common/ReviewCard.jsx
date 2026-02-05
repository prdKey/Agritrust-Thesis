import { useState } from "react";
import { Star, ThumbsUp } from "lucide-react";

const filters = [
  "All",
  "5 Star (3.7K)",
  "4 Star (120)",
  "3 Star (30)",
  "2 Star (16)",
  "1 Star (36)",
  "With Comments (875)",
];

export default function ProductReviews({ reviews = [] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6 mt-6">
      
      {/* HEADER */}
      <h2 className="text-lg font-semibold mb-4">Product Ratings</h2>

      <div className="bg-green-50 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Rating Summary */}
        <div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-green-600">4.9</span>
            <span className="text-sm text-gray-500 mb-1">out of 5</span>
          </div>

          <div className="flex mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className="w-5 h-5 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1 text-sm rounded border transition
                ${
                  activeFilter === f
                    ? "border-green-600 text-green-600 bg-white"
                    : "border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600"
                }`}
            >
              {f}
            </button>
          ))}
          <button className="px-3 py-1 text-sm rounded border border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-600">
            With Media (615)
          </button>
        </div>
      </div>

      {/* REVIEWS LIST */}
      <div className="mt-6 space-y-6">
        {reviews.map((review, index) => (
          <div key={index} className="border-b pb-6 last:border-none">
            
            {/* User */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                👤
              </div>
              <div>
                <p className="text-sm font-medium">{review.user}</p>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Meta */}
            <p className="text-xs text-gray-500 mt-2">
              {review.date} | Variation: {review.variant}
            </p>

            {/* Best Feature */}
            {review.feature && (
              <p className="text-sm mt-2">
                <span className="font-medium">Best Feature:</span>{" "}
                <span className="text-gray-700">{review.feature}</span>
              </p>
            )}

            {/* Review Text */}
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              {review.comment}
            </p>

            {/* Media */}
            {review.media?.length > 0 && (
              <div className="flex gap-2 mt-3">
                {review.media.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="review media"
                    className="w-20 h-20 rounded object-cover border"
                  />
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
              <ThumbsUp className="w-4 h-4" />
              {review.likes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

