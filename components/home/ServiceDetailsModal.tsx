'use client';

import React from 'react';
import { Service } from '@/types';
import { Icons } from '../shared/Icons';

interface ServiceDetailsModalProps {
    service: Service;
    onClose: () => void;
}

const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({ service, onClose }) => {
    // Handle clicks outside the modal
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Stop propagation for clicks inside the modal content
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    // Format price
    const formatPrice = (price: number, currency: string) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div 
            className="fixed inset-0 bg-black/80 z-50 flex justify-center items-center px-4 py-8 backdrop-blur-md animate-fade-in"
            onClick={handleOutsideClick}
        >
            <div 
                className="bg-navy-medium rounded-xl shadow-2xl w-full max-w-4xl min-h-[85vh] max-h-[90vh] flex flex-col animate-fade-in-up relative overflow-hidden"
                onClick={handleContentClick}
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white hover:text-accent-cyan z-10 transition-colors duration-300"
                    title="Close modal"
                    aria-label="Close modal"
                >
                    <Icons.close className="w-8 h-8" />
                </button>

                <div className="p-10 flex flex-col flex-grow overflow-y-auto">
                    {/* Service title */}
                    <h2 className="text-4xl font-bold text-white mb-6">{service.title}</h2>

                    {/* Service description */}
                    <p className="text-light-gray text-lg leading-relaxed mb-10">{service.description}</p>

                    {/* What's Included Section */}
                    <div className="mb-10">
                        <h3 className="text-2xl font-semibold text-white mb-6">What&apos;s Included</h3>
                        <ul className="space-y-5 max-w-3xl">
                            {service.included_items?.map((item: string, index: number) => (
                                <li key={index} className="flex items-start space-x-4">
                                    <svg 
                                        className="w-6 h-6 text-accent-cyan flex-shrink-0 mt-1" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth={2} 
                                            d="M5 13l4 4L19 7" 
                                        />
                                    </svg>
                                    <span className="text-light-gray text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Price and CTA */}
                    <div className="mt-auto flex flex-col md:flex-row items-center gap-6 pt-8 border-t border-navy-dark/30">
                        <div className="text-light-gray text-center md:text-left flex-1">
                            <span className="text-base block mb-1">Starting From</span>
                            <div className="text-3xl font-bold text-white">
                                {formatPrice(service.price_min, service.currency)}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <a 
                                href="#contact"
                                onClick={onClose}
                                className="bg-accent-cyan text-navy-dark text-lg font-bold py-4 px-10 rounded-lg hover:bg-white transition-all duration-300 text-center flex-1 shadow-lg hover:shadow-xl"
                            >
                                Start a Project
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetailsModal;