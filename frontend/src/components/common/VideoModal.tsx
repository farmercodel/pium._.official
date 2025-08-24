
import { motion, AnimatePresence } from "framer-motion";

interface VideoModalProps {
    open: boolean;
    onClose: () => void;
    videoSrc: string;
    title?: string;
}

export function VideoModal({ open, onClose, videoSrc, title = "Demo Video" }: VideoModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[1000] grid place-items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    aria-modal="true"
                    role="dialog"
                    onClick={onClose}
                >
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <motion.div
                        onClick={(e) => e.stopPropagation()}
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 300, damping: 24 }}
                        className="relative w-[95vw] max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-2xl"
                    >
                        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="p-4">
                            <video
                                controls
                                className="w-full h-auto rounded-lg"
                                autoPlay
                                muted
                            >
                                <source src={videoSrc} type="video/webm" />
                                <source src={videoSrc.replace('.webm', '.mp4')} type="video/mp4" />
                                브라우저가 비디오를 지원하지 않습니다.
                            </video>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}