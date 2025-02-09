import { Card, CardContent } from "@/components/ui/card";

interface Recommendation {
  serviceId: number;
  name: string;
  price: number;
  merchant: string;
}

interface RecommendationCardsProps {
  recommendations: Recommendation[];
  onSelect: (recommendation: Recommendation) => void;
}

export default function RecommendationCards({
  recommendations,
  onSelect,
}: RecommendationCardsProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Your Recommendations</h2>
      <div className="grid grid-cols-2 gap-4">
        {recommendations.map((recommendation, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSelect(recommendation)}
          >
            <CardContent className="flex items-center justify-center h-48 p-4">
              <p className="text-lg font-medium text-center">
                {recommendation.name} - ${recommendation.price} by {recommendation.merchant}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
