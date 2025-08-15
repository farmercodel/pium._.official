interface HeroSectionProps {
    onCTAClick: () => void
    className?: string
}

interface FeatureSectionProps {
    className?: string
}

interface UserFlowSectionProps {
    onGuideClick: () => void
    className?: string
}

export type { HeroSectionProps, FeatureSectionProps, UserFlowSectionProps }