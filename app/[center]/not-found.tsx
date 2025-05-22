import Link from 'next/link';

export default function CenterNotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Center Not Found</h1>
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto my-6">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={1.5} 
            stroke="currentColor" 
            className="w-8 h-8 text-red-500"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" 
            />
          </svg>
        </div>
        <p className="text-lg text-gray-600 mb-6">
          The beauty center you're looking for doesn't exist or may have been removed.
        </p>
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Please check the URL or try one of our available centers:
          </p>
          <div className="flex flex-col space-y-2">
            <Link 
              href="/glamour-beauty" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Glamour Beauty Salon
            </Link>
            <Link 
              href="/wellness-spa" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Wellness Spa Center
            </Link>
            <Link 
              href="/radiance-hair" 
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              Radiance Hair Studio
            </Link>
          </div>
        </div>
        <div className="mt-8">
          <Link 
            href="/" 
            className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
