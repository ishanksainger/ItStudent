import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/bundle";
// Icons
import { FaStar } from "react-icons/fa";
// Import required modules
import "../../App.css";

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (data?.success) {
        setReviews(data?.data);
      }
    })();
  }, []);

  // console.log(reviews)

  return (
    <div className="text-white">
      <div className="my-8 max-w-full xl:max-w-maxContent mx-auto">
        <Swiper
          slidesPerView={1}
          spaceBetween={20}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 4,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 5,
              spaceBetween: 50,
            },
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full"
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide
                key={i}
                className="swiper-slide md:!w-60 md:max-h-48 overflow-hidden"
              >
                <div className="flex flex-col gap-3 bg-richblack-800 md:!w-60 md:!h-48 p-3 text-base text-richblack-25">
                  <div className="flex items-center gap-4 h-full">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-9 w-9 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-sm font-medium text-richblack-500">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="mx-auto font-medium text-richblack-25 h-full">
                    {review?.review.split(" ").slice(0, 10).join(" ")}
                    {review?.review.split(" ").length > 10 ? " ..." : ""}
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <h3 className="font-semibold text-yellow-100">
                      {review.rating.toFixed(1)}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review.rating}
                      size={20}
                      edit={false}
                      activeColor="#ffd700"
                      emptyIcon={<FaStar />}
                      fullIcon={<FaStar />}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
