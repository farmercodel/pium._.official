import PageLayout from "../components/common/PageLayout"

import useNavigation from "../hooks/useNavigation"

import HeroSection from "../components/main/HeroSection"

{/** 메인 페이지 */}
const MainPage = () => {

    const { goToSurvey } = useNavigation()

    const navigationHandlers = [
        goToSurvey
    ]

    const handleNavigationClick = (index: number) => {
        if (navigationHandlers[index]) {
            navigationHandlers[index]()
        } else {
            console.log("Unknown navigation index:", index)
        }
    }

    return (
        <PageLayout>
            <HeroSection onCTAClick={() => handleNavigationClick(0)}/>
        </PageLayout>
    )
}

export default MainPage