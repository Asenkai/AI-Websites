import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans">
      <div className="text-center p-8 bg-white rounded-lg shadow-lg">
        <h1 className="font-serif text-6xl font-extrabold text-primary-teal mb-4">404</h1>
        <p className="text-2xl text-gray-800 mb-6">Oops! Page not found</p>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="bg-cta-green hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;