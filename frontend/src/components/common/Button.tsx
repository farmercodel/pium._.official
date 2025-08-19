import React from 'react'

{/** 

    임시로 다른 프로젝트에서 쓰던 
    Button component 가져옴
    추후 수정 필요 

*/}

interface ButtonProps {
    children: React.ReactNode;
    variant?: 'custom' | 'primary' | 'secondary' | 'warning' | 'dimmed' | 'danger'
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

    const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50'

    const variantClasses = {
        custom: "",
        primary: "bg-[#b8d885] hover:bg-[#a2be75] text-white focus:ring-[#caed92] cursor-pointer",
        secondary: "bg-[#b8d885] hover:bg-[#a2be75] text-white focus:ring-[#caed92] cursor-pointer",
        warning: "bg-[#e7e478] hover:bg-[#cbc96a] text-white focus:ring-[#fefb84] cursor-pointer",
        dimmed: "bg-[#c8d1a9] text-white cursor-not-allowed",
        danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 cursor-pointer",
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
