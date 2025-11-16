'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <section id="home" className="flex items-start -mt-16 md:pt-20 pb-0 relative overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.35)]">
            {/* Decorative Shapes */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-accent-cyan opacity-20 rounded-lg transform rotate-45 hidden md:block"></div>
            <div className="absolute top-[10%] left-[5%] w-8 h-8 bg-accent-green opacity-30 rounded-md animate-float"></div>
            <div className="absolute top-[20%] right-[10%] w-12 h-12 bg-accent-green opacity-30 rounded-md animate-float" style={{ animationDelay: '2s' }}></div>
            
            <motion.div 
                className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-center z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="flex justify-center order-last md:order-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    <div className="relative w-full max-w-[400px] h-[300px] md:w-[700px] md:h-[700px]">
                        <Image src="/assets/bio.png" alt="Ike Chidalu Promise" className="relative rounded-lg w-full h-full object-contain" width={700} height={700} />
                    </div>
                </motion.div>
                <div className="text-center md:text-left max-w-lg order-first md:order-none">
                    <motion.h1 variants={itemVariants} className="mt-32 md:mt-0 text-5xl md:text-7xl font-black text-white leading-tight">Greetings,</motion.h1>
                    <motion.h2 variants={itemVariants} className="text-2xl md:text-4xl font-black text-white mt-2">I'm Ike Chidalu Promise</motion.h2>
                    <motion.p variants={itemVariants} className="mt-4 text-lg text-light-gray">the Founder of brandealerbd and I am a Creative Designer. I deal on brands, I make your deals ready which fits good.</motion.p>
                    <motion.div variants={itemVariants}>
                        <a href="#contact" className="mt-8 inline-block bg-accent-cyan text-navy-dark font-bold py-3 px-8 rounded-lg hover:bg-white transition-all duration-300 transform hover:scale-105">Let's Talk</a>
                    </motion.div>
                </div>
            </motion.div>
            <div className="absolute bottom-[20%] left-[15%] w-6 h-6 bg-accent-green opacity-30 transform rotate-45 animate-float" style={{ animationDelay: '4s' }}></div>
            <div className="absolute bottom-[10%] right-[5%] w-10 h-10 bg-accent-green opacity-20 rounded-lg animate-float" style={{ animationDelay: '1s' }}></div>
        </section>
    );
};

export default Hero;
