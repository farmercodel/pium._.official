import { useNavigate } from 'react-router-dom'

const useNavigation = () => {
    const navigate = useNavigate()

    const goToMain = () => navigate("/")

    return {
        goToMain,
    }
    
}

export default useNavigation