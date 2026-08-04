import { Clipboard, FileText } from "lucide-react";

export default function CoverLetterCard({ coverLetter }) {

  const copyLetter = async () => {
    await navigator.clipboard.writeText(coverLetter);
    alert("Cover letter copied!");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold flex items-center gap-2">

          <FileText className="text-blue-600"/>

          Cover Letter

        </h2>

        <button
          onClick={copyLetter}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >

          <Clipboard size={18}/>

          Copy

        </button>

      </div>

      <div className="bg-slate-50 rounded-lg p-6 leading-8 whitespace-pre-line">

        {coverLetter}

      </div>

    </div>
  );
}