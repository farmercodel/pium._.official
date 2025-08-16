import { useNavigate } from 'react-router-dom'

const useNavigation = () => {
    const navigate = useNavigate()

    const goToAdmin = () => navigate("/admin")
    const goToMain = () => navigate("/")
    const goToPreview = () => navigate("/preview")
    const goToEmpty = () => navigate("/")
    const goToAbout = () => navigate("/about")
    const goToSurvey = () => navigate("/survey")
    const goToGeneration = () => navigate("/generation")
    const goToResult = () => navigate("/result")
    const goToGuide = () => navigate("/guide")
    const goToLogin = () => navigate("/login")
    const goToSignUp = () => navigate("/signup")

    return {
        goToAdmin,
        goToMain,
        goToPreview,
        goToEmpty,
        goToAbout,
        goToSurvey,
        goToGeneration,
        goToResult,
        goToGuide,
        goToLogin,
        goToSignUp,
    }
    
}

export default useNavigation