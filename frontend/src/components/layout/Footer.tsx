import { FaEnvelope, FaInstagram, FaGithub } from 'react-icons/fa'

function Footer() {
    return (
        <footer className="w-full bg-gray-900 text-gray-500 py-6">
            <div className="w-full px-4">
                {/* 상단: 로고 + 링크들 */}
                <div className="flex justify-center items-center space-x-8 mb-4">
                    {/* 로고 */}
                    {/* <div className="cursor-pointer">
                        <img src="/assets/logo.png" alt="PIUM Logo" className="w-10 h-10" />
                    </div> */}
                    
                    {/* Email */}
                    <a href="mailto:team@pium.com" className="hover:text-white transition flex items-center space-x-2">
                        <FaEnvelope className="w-5 h-5" />
                        <span>Email</span>
                    </a>
                    
                    {/* Instagram */}
                    <a href="https://www.instagram.com/pium_official/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center space-x-2">
                        <FaInstagram className="w-5 h-5" />
                        <span>Instagram</span>
                    </a>
                    
                    {/* GitHub */}
                    <a href="https://github.com/farmercodel/pium._.official" target="_blank" rel="noopener noreferrer" className="hover:text-white transition flex items-center space-x-2">
                        <FaGithub className="w-5 h-5" />
                        <span>GitHub</span>
                    </a>
                </div>
                
                {/* 하단: 저작권 */}
                <div className="text-center">
                    <p>© 2025 PIUM. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;