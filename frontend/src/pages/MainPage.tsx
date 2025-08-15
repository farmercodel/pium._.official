import PageLayout from "../components/common/PageLayout"

import useNavigation from "../hooks/useNavigation"

import HeroSection from "../components/main/HeroSection"
import FeatureSection from "../components/main/FeatureSection"
import UserFlowSection from "../components/main/UserFlowSection"

{/** 메인 페이지 */}
const MainPage = () => {

    const { goToSurvey, goToGuide } = useNavigation()
    const navigationMap = {
        'survey': goToSurvey,
        'guide': goToGuide,
    }

    const handleItemClick = (itemName: string) => {
        const navigationFn = navigationMap[itemName as keyof typeof navigationMap]
        if (navigationFn) {
            navigationFn()
            close()
        } else {
            console.log("Unknown navigation item:", itemName)
        }
    }

    return (
        <PageLayout>
            <HeroSection onCTAClick={() => handleItemClick('survey')}/>
            <FeatureSection />
            <UserFlowSection onGuideClick={() => handleItemClick('guide')}/>
        </PageLayout>
    )
}

export default MainPage