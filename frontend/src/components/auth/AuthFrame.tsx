interface AuthFrameProps {
    children: React.ReactNode
}

const AuthFrame = ({ children }: AuthFrameProps) => {
    return (
        <div className="flex items-center justify-center p-4">
            {/* 인증 폼 테두리 틀 */}
            <div className="border-2 border-gray-300 rounded-2xl shadow-lg flex items-center justify-center px-6 py-8 flex-col">
                {children}
            </div>
        </div>
    )
}

export default AuthFrame