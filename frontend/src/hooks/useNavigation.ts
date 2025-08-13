import { useNavigate } from 'react-router-dom'

const useNavigation = () => {
    const navigate = useNavigate()

    const goToMain = () => navigate("/")
    const goToSurvey = () => navigate("/survey")
    const goToGeneration = () => navigate("/generation")
    const goToResult = () => navigate("/result")
    const goToAbout = () => navigate("/about")
    const goToGuide = () => navigate("/guide")

    return {
        goToMain,
        goToSurvey,
        goToGeneration,
        goToResult,
        goToAbout,
        goToGuide,
    }
    
}

export default useNavigation