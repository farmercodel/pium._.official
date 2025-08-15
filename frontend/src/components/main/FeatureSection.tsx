import type { FeatureSectionProps } from "../../types/mainPageSection"
import Card from "../card/Card"
import CardSection from "../card/CardSection"
import photo1 from "../card/asset/photo1.jpg"
import photo2 from "../card/asset/photo2.jpg"
import photo3 from "../card/asset/photo3.jpg"

const FeatureSection = ({ className }: FeatureSectionProps) => {
  return (
    <section
      className={`relative w-full bg-white p-4 sm:p-6 lg:p-10 lg:px-35 shadow-lg ${className}`}
    >
      <h2 className="text-2xl font-bold mb-6">Feature Section</h2>
      <CardSection columns={3} gap="small" className="max-w-4xl mx-auto">
        <Card hover rounded="medium" padding="small" className="aspect-square overflow-hidden">
          <img src={photo1} alt="Photo 1" className="w-full h-full object-cover" />
        </Card>
        <Card hover rounded="medium" padding="small" className="aspect-square overflow-hidden">
          <img src={photo2} alt="Photo 2" className="w-full h-full object-cover" />
        </Card>
        <Card hover rounded="medium" padding="small" className="aspect-square overflow-hidden">
          <img src={photo3} alt="Photo 3" className="w-full h-full object-cover" />
        </Card>
      </CardSection>
    </section>
  )
}
export default FeatureSection