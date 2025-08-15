import React from 'react'

interface CardSectionProps {
    children: React.ReactNode
    columns?: 1|2|3|4
    gap?:'small'| 'medium' |'large'
    className?:string
}

const gapClasses = {
    small : "gap-2",
    medium : "gap-4",
    large: "gap-6"
}

export default function CardSection({
    children,
    columns = 3,
    gap = 'medium',
    className = ""
}: CardSectionProps) {
    const columnClass = `grid grid-cols-${columns}`
    return(
        <div className = {`${columnClass} ${gapClasses[gap]} ${className}`}>
        {children}
        </div>
    )
}