import React from 'react'

interface CardSectionProps {
  children: React.ReactNode
  columns?: 1 | 2 | 3 | 4
  gap?: 'small' | 'medium' | 'large'
  className?: string
}

const gapClasses = {
  small: 'gap-2',
  medium: 'gap-4',
  large: 'gap-6',
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

export default function CardSection({
  children,
  columns = 3,
  gap = 'medium',
  className = '',
}: CardSectionProps) {
  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement<React.HTMLAttributes<HTMLDivElement>>(child)) return child

        return React.cloneElement<React.HTMLAttributes<HTMLDivElement>>(child, {
          className: `${child.props.className || ''} w-full h-full`,
        })
      })}
    </div>
  )
}