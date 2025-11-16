'use client';

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Grid } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import Image from 'next/image';
import { GalleryItem } from '@/types/index';
import Section from '@/components/shared/Section';
import { Icons } from '@/components/shared/Icons';
import GalleryModal from './GalleryModal';

// This is the client component that renders the Swiper carousel.
const GallerySlider = ({ items }: { items: Partial<GalleryItem>[] }) => {
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

    return (
        <>
            <Section id="gallery">
                <h2 className="text-5xl font-black text-white mb-12 text-center">My Gallery</h2>
                <div className="relative px-4 md:px-8">
                    <Swiper
                        modules={[Grid, Navigation]}
                        grid={{
                            rows: 2,
                            fill: 'row',
                        }}
                        navigation={{
                            nextEl: '.swiper-button-next-gallery',
                            prevEl: '.swiper-button-prev-gallery',
                        }}
                        className="mySwiper-gallery-grid"
                        breakpoints={{
                            320: {
                                slidesPerView: 2,
                                spaceBetween: 10,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 15,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 30,
                            },
                        }}
                    >
                        {items.map((item) => (
                            <SwiperSlide key={item.id}>
                                <div className="group relative overflow-hidden rounded-lg shadow-lg h-full border-2 border-accent-cyan/30 transition-colors duration-300">
                                    <Image 
                                        src={item.imageUrl!} 
                                        alt={item.category!} 
                                        width={300} 
                                        height={300}
                                        className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                        <button onClick={() => setSelectedItem(item as GalleryItem)} className="bg-accent-cyan text-navy-dark font-bold py-2 px-6 rounded-md transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-105">View</button>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="swiper-button-prev-gallery absolute top-1/2 left-0 transform -translate-y-1/2">
                        <Icons.chevronLeft className="w-10 h-10 text-white bg-navy-dark rounded-full p-2 cursor-pointer hover:bg-accent-cyan" />
                    </div>
                    <div className="swiper-button-next-gallery absolute top-1/2 right-0 transform -translate-y-1/2">
                        <Icons.chevronRight className="w-10 h-10 text-white bg-navy-dark rounded-full p-2 cursor-pointer hover:bg-accent-cyan" />
                    </div>
                </div>
            </Section>
            {selectedItem && (
                <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </>
    );
};

export default GallerySlider;