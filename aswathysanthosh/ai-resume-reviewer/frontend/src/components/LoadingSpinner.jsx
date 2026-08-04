export default function LoadingSpinner() {

    return (

        <div className="text-center mt-10">

            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>

            <p className="mt-4 text-gray-600">
                AI is analyzing your resume...
            </p>

        </div>

    );

}