interface InputBoxProps {
    placeholder: string
    title?: string
    value?: string
    border?: 'none' | 'default' | 'error'
    onChange?: (value: string) => void
    className?: string
    required?: boolean
}

const InputBox = ({ 
    placeholder, 
    title, 
    value, 
    onChange, 
    border = 'default',
    className,
    required = false
}: InputBoxProps) => {

    const baseClasses = 'w-full p-2 px-4 border-2 border-gray-300 rounded-md placeholder-gray-400'
    const borderClasses = {
        none: 'border-none',
        default: 'border-gray-300',
        error: 'border-red-500',
    }
    
    return <div className="flex flex-col">
        {title && <p className="text-sm text-gray-500">{title}{required && <span className="text-red-500">*</span>}</p>}
        <input type="text" placeholder={placeholder} value={value} onChange={(e) => onChange?.(e.target.value)} className={`${baseClasses} ${borderClasses[border]} ${className}`} />
    </div>
}

export default InputBox