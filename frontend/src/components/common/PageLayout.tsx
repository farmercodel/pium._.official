import type { PageLayoutProps } from "../../types/pageLayout"

const PageLayout = ({ children, className }: PageLayoutProps) => {
    return (
        <div className={`${className}`}>
            {children}
        </div>
    )
}

export default PageLayout