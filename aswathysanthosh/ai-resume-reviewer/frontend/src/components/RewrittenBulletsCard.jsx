export default function RewrittenBulletsCard({ bullets }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <h2 className="text-xl font-bold mb-4">
        Improved Resume Bullet Points
      </h2>

      <ul className="space-y-4">

        {bullets.map((bullet, index) => (
          <li
            key={index}
            className="bg-slate-50 rounded-lg p-4"
          >
            • {bullet}
          </li>
        ))}

      </ul>

    </div>
  );
}