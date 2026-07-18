import { useEffect, useState } from "react";

export default function ScoreCard({ analysis }) {
  const score = analysis.ats_score;

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;

    const timer = setInterval(() => {
      current++;

      if (current >= score) {
        current = score;
        clearInterval(timer);
      }

      setProgress(current);
    }, 18);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 75;
  const circumference = 2 * Math.PI * radius;

  const offset =
    circumference -
    (progress / 100) * circumference;

  let color = "#ef4444";
  let label = "Needs Improvement";

  if (score >= 75) {
    color = "#16a34a";
    label = "Excellent";
  } else if (score >= 50) {
    color = "#f59e0b";
    label = "Good";
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-6">
        ATS Score
      </h2>

      <div className="flex justify-center">

        <svg
          width="200"
          height="200"
        >

          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="12"
            fill="none"
          />

          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 100 100)"
            style={{
              transition: "stroke-dashoffset .25s"
            }}
          />

          <text
            x="100"
            y="95"
            textAnchor="middle"
            className="font-bold text-4xl"
            fill={color}
          >
            {progress}%
          </text>

          <text
            x="100"
            y="122"
            textAnchor="middle"
            className="font-semibold"
            fill={color}
          >
            {label}
          </text>

        </svg>

      </div>

      <div className="mt-8 space-y-4">

        <ProgressBar
          title="Contact"
          value={analysis.breakdown.contact}
          total={10}
        />

        <ProgressBar
          title="Sections"
          value={analysis.breakdown.sections}
          total={30}
        />

        <ProgressBar
          title="Keywords"
          value={analysis.breakdown.keywords}
          total={20}
        />

        <ProgressBar
          title="Formatting"
          value={analysis.breakdown.formatting}
          total={20}
        />

      </div>

    </div>
  );
}

function ProgressBar({
  title,
  value,
  total,
}) {
  const percentage = (value / total) * 100;

  return (
    <div>

      <div className="flex justify-between mb-1">

        <span>{title}</span>

        <span>

          {value}/{total}

        </span>

      </div>

      <div className="h-3 rounded-full bg-gray-200 overflow-hidden">

        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}