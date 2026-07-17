export default function KeywordCard({ analysis }) {

    return (

        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-xl font-bold">

                Keywords Analysis

            </h2>

            <div className="mt-6">

                <h3 className="font-semibold text-green-600 mb-3">

                    Found Keywords

                </h3>

                <div className="flex flex-wrap gap-2">

                    {analysis.matched_keywords.map((item, index) => (

                        <span
                            key={index}
                            className="bg-green-100 text-green-700 px-3 py-2 rounded-full text-sm"
                        >
                            {item}
                        </span>

                    ))}

                </div>

            </div>

            <div className="mt-8">

                <h3 className="font-semibold text-red-600 mb-3">

                    Missing Keywords

                </h3>

                <div className="flex flex-wrap gap-2">

                    {analysis.missing_keywords.map((item, index) => (

                        <span
                            key={index}
                            className="bg-red-100 text-red-700 px-3 py-2 rounded-full text-sm"
                        >
                            {item}
                        </span>

                    ))}

                </div>

            </div>

        </div>

    );

}