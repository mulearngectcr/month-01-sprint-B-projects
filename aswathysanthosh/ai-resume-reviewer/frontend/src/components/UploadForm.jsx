import { useState } from "react";
import {
  Brain,
  Sparkles,
  FileText,
  BadgeCheck,
  UploadCloud,
  CheckCircle,
  Trash2,
} from "lucide-react";

export default function UploadForm({ onAnalyze, loading }) {
  const [file, setFile] = useState(null);
  const [role, setRole] = useState("AI Engineer");
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = () => {
    if (!file) return;
    onAnalyze(file, role);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    validateFile(droppedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-12">

      {/* Header */}

      <div className="text-center">

        <div className="flex justify-center">

          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">

            <Brain className="text-white w-10 h-10" />

          </div>

        </div>

        <h1 className="text-5xl font-bold mt-6 text-slate-800">
          AI Resume Reviewer
        </h1>

        <p className="mt-4 text-lg text-slate-500">
          Optimize your resume with AI-powered ATS analysis.
        </p>

        <div className="flex justify-center flex-wrap gap-3 mt-6">

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2">
            <BadgeCheck size={18} />
            ATS Score
          </span>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2">
            <Brain size={18} />
            AI Feedback
          </span>

          <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full flex items-center gap-2">
            <FileText size={18} />
            Cover Letter
          </span>

        </div>

      </div>

      {/* Upload */}

      <div className="mt-12">

        <label className="block font-semibold mb-3">
          Upload Resume
        </label>

        <label
          htmlFor="resume"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          className={`
            flex
            flex-col
            items-center
            justify-center
            border-2
            border-dashed
            rounded-2xl
            py-12
            cursor-pointer
            transition-all
            duration-300

            ${
              file
                ? "border-green-400 bg-green-50"
                : isDragging
                ? "border-blue-600 bg-blue-100 scale-[1.02]"
                : "border-blue-300 hover:bg-blue-50"
            }
          `}
        >

          {file ? (
            <>

              <CheckCircle
                className="text-green-600"
                size={60}
              />

              <h2 className="mt-4 text-2xl font-bold text-green-700">
                Resume Uploaded
              </h2>

              <p className="mt-2 text-gray-700 font-medium">
                {file.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>

              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setFile(null);
                }}
                className="mt-5 flex items-center gap-2 text-red-500 hover:text-red-700 font-medium"
              >
                <Trash2 size={18} />
                Remove File
              </button>

            </>
          ) : (
            <>

              <UploadCloud
                className="text-blue-600"
                size={60}
              />

              <h2 className="mt-4 text-2xl font-bold text-slate-700">
                Drag & Drop Resume
              </h2>

              <p className="mt-2 text-gray-500">
                or Click to Browse
              </p>

              <p className="text-sm text-gray-400 mt-3">
                PDF only • Max 5 MB
              </p>

            </>
          )}

        </label>

        <input
          id="resume"
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => validateFile(e.target.files[0])}
        />

      </div>

      {/* Role */}

      <div className="mt-8">

        <label className="font-semibold block mb-2">
          Target Role
        </label>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option>AI Engineer</option>
          <option>Machine Learning Engineer</option>
          <option>Software Engineer</option>
          <option>Backend Developer</option>
          <option>Frontend Developer</option>
          <option>Data Scientist</option>
        </select>

      </div>

      {/* Button */}

      <button
        onClick={handleSubmit}
        disabled={loading || !file}
        className="
          mt-8
          w-full
          py-4
          rounded-xl
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          text-white
          font-bold
          flex
          justify-center
          items-center
          gap-2
          transition-all
          hover:scale-[1.02]
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >

        <Sparkles size={20} />

        {loading ? "Analyzing Resume..." : "Analyze Resume"}

      </button>

    </div>
  );
}