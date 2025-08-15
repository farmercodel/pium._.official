interface FeatureSectionProps {
    className?: string
}

{/** 샘플 문구 예시 , 이미지 Before/After, 생성된 해시태그 예시  */}
const FeatureSection = ({ className }: FeatureSectionProps) => {
    return (
        <section className={`relative w-full bg-white p-4 sm:p-6 lg:p-10 lg:px-35 shadow-lg ${className}`}>
            FeatureSection 
        </section>
    )
}

export default FeatureSection