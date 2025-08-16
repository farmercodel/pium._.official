import React from 'react'

{/** 

    임시로 다른 프로젝트에서 쓰던 
    Button component 가져옴
    추후 수정 필요 

*/}

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'custom' | 'primary' | 'secondary' | 'danger' | 'ghost' | 'success' | 'noneBorder'
    size?: 'custom' | 'small' | 'medium' | 'large'
    className?: string
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    fullWidth?: boolean
}

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    className,
    onClick,
    disabled = false,
    type = 'button',
    fullWidth = false,
}: ButtonProps) => {

    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'

    const variantClasses = {
        custom: "",
        primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
        secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
        ghost: "bg-transparent hover:bg-gray-100 text-gray-700 border border-gray-300 focus:ring-gray-500",
        success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
        noneBorder: "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    }

    const sizeClasses = {
        custom: "",
        small: "px-3 py-1.5 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg"
    }

    const widthClass = fullWidth ? "w-full" : ""

    return (
        <button
        type={type}
        className={`
            ${baseClasses}
            ${variantClasses[variant]}
            ${sizeClasses[size]}
            ${widthClass}
            ${className}
        `}
        onClick={onClick}
        disabled={disabled}
        >
            {children}
        </button>
    )
}

export default Button;