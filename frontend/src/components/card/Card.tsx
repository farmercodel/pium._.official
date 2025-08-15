import React from 'react'

interface CardProps {
  children?: React.ReactNode
  className?: string
  padding?: 'none' | 'small' | 'medium' | 'large'
  shadow?: 'none' | 'small' | 'medium' | 'large'
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full'
  hover?: boolean
  onClick?: () => void
}

const Card = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  rounded = 'large',
  onClick,
}: CardProps) => {
  const paddingClasses = {
    none: '',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8',
  }

  const shadowClasses = {
    none: '',
    small: 'shadow-sm',
    medium: 'shadow-md',
    large: 'shadow-lg',
  }

  const roundedClasses = {
    none: '',
    small: 'rounded-sm',
    medium: 'rounded-md',
    large: 'rounded-lg',
    full: 'rounded-full',
  }

  const hoverClasses = hover
    ? 'hover:shadow-xl hover:scale-105 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ease-in-out cursor-pointer transform'
    : ''

  return (
    <div
      className={`
        bg-white border border-gray-200
        ${paddingClasses[padding]}
        ${shadowClasses[shadow]}
        ${hoverClasses}
        ${roundedClasses[rounded]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

export default Card
