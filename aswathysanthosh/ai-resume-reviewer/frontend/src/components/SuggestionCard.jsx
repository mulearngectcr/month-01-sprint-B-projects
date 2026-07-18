import { Lightbulb } from "lucide-react";

export default function SuggestionCard({ analysis }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">

        <Lightbulb className="text-yellow-500" />

        Suggestions

      </h2>

      <div className="space-y-4">

        {analysis.suggestions.map((item, index) => (

          <div
            key={index}
            className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4"
          >
            {item}
          </div>

        ))}

      </div>

    </div>
  );
}