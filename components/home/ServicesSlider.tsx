'use client';

import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, EffectCoverflow } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import type { Service } from '@/types/index';
import Section from '@/components/shared/Section';
import { Icons } from '@/components/shared/Icons';
import ServiceDetailsModal from './ServiceDetailsModal';
import { createClient } from '@/lib/supabase/client';

const ServiceCard: React.FC<{ service: Service; onViewDetails: () => void }> = ({ service, onViewDetails }) => {
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', { 
            style: 'currency', 
            currency, 
            minimumFractionDigits: 0,
            maximumFractionDigits: 0 
        }).format(price);
    };

    return (
        <div className="group h-full perspective-[2000px]">
            <div className="relative h-full transform-style-preserve-3d transition-all duration-500 ease-out -rotate-y-12 -rotate-x-3 group-hover:rotate-y-0 group-hover:rotate-x-0 group-hover:-translate-y-2">
                <div className="bg-[#151538] p-6 rounded-lg shadow-lg text-center flex flex-col justify-between h-full border-2 border-transparent group-hover:border-accent-cyan transition-colors duration-300">
                    <div className="flex-1 flex flex-col justify-center">
                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4">{service.title}</h3>
                    </div>
                    
                    {/* Dark inset panel for price and CTA */}
                    <div className="bg-[#0d0d2b] w-[85%] mx-auto rounded-lg py-12 px-5 shadow-inner flex flex-col items-center justify-center">
                        <div className="bg-[#151538] w-full max-w-[200px] px-4 py-3 rounded-md shadow-md border-b border-gray-800/50">
                            <p className="text-light-gray text-sm font-medium">
                                {formatPrice(service.price_min, service.currency)} - {formatPrice(service.price_max, service.currency)}
                            </p>
                        </div>
                        
                        <div className="mt-4">
                            <button 
                                onClick={onViewDetails}
                                className="bg-accent-cyan text-navy-dark text-sm font-semibold py-1.5 px-6 rounded-md hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-sm"
                                aria-label={`View details for ${service.title}`}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServicesSlider = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .order('id');

            if (error) {
                console.error('Error fetching services:', error);
                return;
            }

            if (data) {
                setServices(data);
            }
        };

        fetchServices();
    }, []);

    return (
        <>
            <div className="py-8">
                <Swiper
                    effect={'coverflow'}
                    grabCursor={true}
                    centeredSlides={true}
                    slidesPerView={'auto'}
                    coverflowEffect={{
                        rotate: 0,
                        stretch: 0,
                        depth: 100,
                        modifier: 2.5,
                        slideShadows: false,
                    }}
                    modules={[EffectCoverflow, Navigation]}
                    className="swiper-container"
                    navigation={{
                        prevEl: '.swiper-button-prev',
                        nextEl: '.swiper-button-next',
                    }}
                >
                    {services.map((service) => (
                        <SwiperSlide key={service.id} className="w-full max-w-[380px] !h-auto">
                            <div className="px-4 py-2 h-[400px]">
                                <ServiceCard 
                                    service={service}
                                    onViewDetails={() => setSelectedService(service)}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                    
                    <div className="swiper-button-prev !text-accent-cyan after:!text-2xl"></div>
                    <div className="swiper-button-next !text-accent-cyan after:!text-2xl"></div>
                </Swiper>
            </div>

            {/* Service Details Modal */}
            {selectedService && (
                <ServiceDetailsModal
                    service={selectedService}
                    onClose={() => setSelectedService(null)}
                />
            )}
        </>
    );
};

export default ServicesSlider;
