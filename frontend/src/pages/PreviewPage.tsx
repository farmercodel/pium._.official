import PageLayout from "../components/common/PageLayout"
import InstaPreview from "../components/preview/InstaPreview"


{/** 미리보기 페이지 */}
const PreviewPage = () => {
    return (
        <PageLayout>
            <div className="flex flex-row gap-4 justify-center flex-wrap mt-5"> 
                <InstaPreview POST_ID="pium._.official" />
                <InstaPreview POST_ID="DNWI2mUpQFE" />
            </div>
        </PageLayout>
    )
}

export default PreviewPage