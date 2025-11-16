'use client';

import React from 'react';
import Image from 'next/image';
import type { GalleryItem } from '@/types/index';
import { Icons } from '@/components/shared/Icons';

interface GalleryModalProps {
    item: GalleryItem;
    onClose: () => void;
}

export default function GalleryModal({ item, onClose }: GalleryModalProps) {
    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Stop propagation to prevent closing the modal when clicking inside the content
    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in"
            onClick={handleOutsideClick}
        >
            <div 
                className="bg-navy-medium rounded-xl shadow-2xl w-full max-w-lg max-h-[95vh] flex flex-col animate-fade-in-up relative"
                onClick={handleContentClick}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-accent-cyan z-10">
                    <Icons.close className="w-8 h-8" />
                </button>

                <div className="relative w-full h-96">
                    <Image 
                        src={item.imageUrl} 
                        alt={item.title || 'Gallery Item'} 
                        layout="fill"
                        className="object-contain rounded-t-xl"
                    />
                </div>

                <div className="p-8 flex flex-col flex-grow">
                    <h2 className="text-3xl font-bold text-white mb-2">{item.title}</h2>
                    <p className="text-light-gray mb-6 flex-grow">{item.description}</p>
                    
                    <div className="mt-auto flex flex-col md:flex-row gap-4">
                        {item.project_url && (
                            <a 
                                href={item.project_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-accent-cyan text-navy-dark font-bold py-3 px-8 rounded-lg hover:bg-white transition-all duration-300 text-center flex-1"
                            >
                                View Project
                            </a>
                        )}
                        <a 
                            href="#contact" 
                            onClick={onClose}
                            className="bg-navy-light text-white font-bold py-3 px-8 rounded-lg hover:bg-navy-dark transition-all duration-300 text-center flex-1"
                        >
                            Let's Talk
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}