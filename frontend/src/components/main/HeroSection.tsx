import { ArrowRightIcon } from "@heroicons/react/24/outline"
import { HERO_CONTENT } from "../../constants/mainConstant"

import { motion } from "framer-motion"

import Button from "../common/Button"

interface HeroSectionProps {
    onCTAClick: () => void
    className?: string
}

const HeroSection = ({ onCTAClick, className }: HeroSectionProps) => {
    return (
        <section className={`relative w-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 p-4 sm:p-6 lg:p-10 lg:px-35 shadow-lg ${className}`}>
            {/* 모바일: 세로 배치, 데스크톱: 가로 배치 */}
            <motion.div 
                className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}    
            >
                {/* Left: Text */}
                <div className="flex-1 text-white space-y-4 sm:space-y-6 text-center lg:text-left">
                    <div className="bg-black/10 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                        <h2 className="text-3xl sm:text-4xl font-bold pb-2">{HERO_CONTENT.title}</h2>
                        <p className="text-base sm:text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 pb-4">
                            {HERO_CONTENT.description}
                        </p>

                        {/* Feature Points */}
                        <ul className="space-y-2 text-sm sm:text-base">
                            <li className="flex items-center gap-2 justify-center lg:justify-start">
                                <span className="bg-white/20 rounded-full p-1">{HERO_CONTENT.featurePoints[0].icon}</span>
                                {HERO_CONTENT.featurePoints[0].text}
                            </li>
                            <li className="flex items-center gap-2 justify-center lg:justify-start">
                                <span className="bg-white/20 rounded-full p-1">{HERO_CONTENT.featurePoints[1].icon}</span>
                                {HERO_CONTENT.featurePoints[1].text}
                            </li>
                            <li className="flex items-center gap-2 justify-center lg:justify-start">
                                <span className="bg-white/20 rounded-full p-1">{HERO_CONTENT.featurePoints[2].icon}</span>
                                {HERO_CONTENT.featurePoints[2].text}
                            </li>
                        </ul>
                    </div>
                    {/* CTA Button */}
                    <Button
                        onClick={onCTAClick}
                        className="bg-white text-emerald-500 px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-50 transition mx-auto lg:mx-0 w-fit"
                        variant="custom"
                        size="custom"
                    >
                        {HERO_CONTENT.cta}
                        <ArrowRightIcon className="size-5" />
                    </Button>

                </div>

                {/* Right: Image with Overlap Effect */}
                <div className="flex-1 flex justify-center items-center rounded-xl p-4 lg:p-0 relative">
                    {/* Left Top Image */}
                    <img
                        src={HERO_CONTENT.img[0].src}
                        alt={HERO_CONTENT.img[0].alt}
                        className="rounded-xl shadow-2xl w-64 sm:w-72 lg:w-80 relative bottom-6 lg:bottom-3 z-20
             transform -rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-300"
                    />

                    {/* Right Bottom Image (Overlapping) */}
                    <img
                        src={HERO_CONTENT.img[1].src}
                        alt={HERO_CONTENT.img[1].alt}
                        className="rounded-xl shadow-xl w-64 sm:w-72 lg:w-80 absolute lg:-bottom-3 -right-6 z-10
             transform rotate-6 hover:rotate-3 hover:scale-105 hover:z-25 transition-transform duration-300"
                    />
                </div>
            </motion.div>
        </section>
    )
}

export default HeroSection