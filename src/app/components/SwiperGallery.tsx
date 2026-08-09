// app/work/[slug]/SwiperGallery.jsx
'use client';
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

type SwiperGalleryProps = {
  images: string[];
  title: string;
};

export default function SwiperGallery({ images, title }: SwiperGalleryProps) {
  return (
    <div className="mb-10">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop
        spaceBetween={20}
        slidesPerView={1}
      >
        {images.map((img, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={img}
                alt={`${title} image ${idx + 1}`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
