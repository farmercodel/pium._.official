import type { PageLayoutProps } from "../../types/pageLayout"

const PageLayout = ({ children, className }: PageLayoutProps) => {
    return (
        <div className={`container mx-auto px-4 py-8 ${className}`}>
            {children}
        </div>
    )
}

export default PageLayout