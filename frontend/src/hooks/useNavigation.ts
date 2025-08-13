import { useNavigate } from 'react-router-dom'

const useNavigation = () => {
    const navigate = useNavigate()

    const goToMain = () => navigate("/")
    const goToPreview = () => navigate("/preview")
    const goToEmpty = () => navigate("/")
    const goToAbout = () => navigate("/about")
    const goToSurvey = () => navigate("/survey")
    const goToGeneration = () => navigate("/generation")
    const goToResult = () => navigate("/result")
    const goToGuide = () => navigate("/guide")

    return {
        goToMain,
        goToPreview,
        goToEmpty,
        goToAbout,
        goToSurvey,
        goToGeneration,
        goToResult,
        goToGuide,
    }
    
}

export default useNavigation