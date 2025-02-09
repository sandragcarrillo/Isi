import { Card, CardContent } from "@/components/ui/card";

interface PreferenceSelectorProps {
  question: string;
  options: string[];
  onSelect: (option: string) => void;
}

export default function PreferenceSelector({
  question,
  options,
  onSelect,
}: PreferenceSelectorProps) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{question}</h2>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:bg-gray-100 transition-colors"
            onClick={() => onSelect(option)}
          >
            <CardContent className="flex items-center justify-center h-32">
              <p className="text-lg font-medium">{option}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
