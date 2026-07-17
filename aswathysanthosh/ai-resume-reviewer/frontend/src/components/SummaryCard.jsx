import {
  Star,
  TrendingUp,
  Award,
  AlertCircle,
} from "lucide-react";

export default function SummaryCard({ analysis, ai }) {
  const score = analysis.ats_score;

  let quality = "Needs Improvement";
  let interview = "Low";
  let stars = 2;

  if (score >= 75) {
    quality = "Excellent";
    interview = "High";
    stars = 5;
  } else if (score >= 60) {
    quality = "Good";
    interview = "Moderate";
    stars = 4;
  } else if (score >= 50) {
    quality = "Average";
    interview = "Moderate";
    stars = 3;
  }

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-white p-8">

      <h2 className="text-3xl font-bold mb-8">

        Overall Resume Review

      </h2>

      <div className="flex items-center gap-2 mb-8">

        {[1,2,3,4,5].map((n)=>(
          <Star
            key={n}
            size={28}
            fill={n<=stars ? "white" : "transparent"}
          />
        ))}

      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <SummaryItem
          icon={<Award size={24}/>}
          title="ATS Score"
          value={`${score}%`}
        />

        <SummaryItem
          icon={<TrendingUp size={24}/>}
          title="Resume Quality"
          value={quality}
        />

        <SummaryItem
          icon={<Award size={24}/>}
          title="Interview Readiness"
          value={interview}
        />

        <SummaryItem
          icon={<AlertCircle size={24}/>}
          title="Top Improvement"
          value={
            analysis.missing_keywords[0] ??
            "Improve ATS Keywords"
          }
        />

      </div>

    </div>
  );
}

function SummaryItem({
  icon,
  title,
  value,
}) {
  return (
    <div className="bg-white/15 rounded-xl p-5 backdrop-blur">

      <div className="mb-3">

        {icon}

      </div>

      <p className="text-sm opacity-80">

        {title}

      </p>

      <h3 className="text-xl font-bold mt-2">

        {value}

      </h3>

    </div>
  );
}