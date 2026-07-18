import { CheckCircle, XCircle } from "lucide-react";

export default function AIReviewCard({ ai }) {
  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* Strengths */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-xl font-bold text-green-600 mb-6">
          Strengths
        </h2>

        <div className="space-y-4">

          {ai.strengths.map((item, index) => (

            <div
              key={index}
              className="flex items-start gap-3 bg-green-50 p-3 rounded-lg"
            >

              <CheckCircle
                className="text-green-600 mt-1"
                size={20}
              />

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

      {/* Weaknesses */}

      <div className="bg-white rounded-xl shadow-lg p-6">

        <h2 className="text-xl font-bold text-red-600 mb-6">
          Weaknesses
        </h2>

        <div className="space-y-4">

          {ai.weaknesses.map((item, index) => (

            <div
              key={index}
              className="flex items-start gap-3 bg-red-50 p-3 rounded-lg"
            >

              <XCircle
                className="text-red-600 mt-1"
                size={20}
              />

              <span>{item}</span>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}