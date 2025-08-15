import PageLayout from "../components/common/PageLayout"

import useNavigation from "../hooks/useNavigation"

import HeroSection from "../components/main/HeroSection"
import FeatureSection from "../components/main/FeatureSection"

{/** 메인 페이지 */}
const MainPage = () => {

    const { goToSurvey } = useNavigation()
    const navigationMap = {
        '지금 시작하기': goToSurvey,
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
            <HeroSection onCTAClick={() => handleItemClick('지금 시작하기')}/>
            <FeatureSection />
        </PageLayout>
    )
}

export default MainPage