import { useEffect } from "react";
import { useLocation } from "wouter";
import { APP_LOGO } from "@/const";

export default function Welcome() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Show welcome screen for 2 seconds, then redirect to admin
    const timer = setTimeout(() => {
      setLocation("/admin");
    }, 2000);

    return () => clearTimeout(timer);
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="text-center space-y-6 animate-fade-in">
        {/* Logo */}
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-2xl flex items-center justify-center ring-8 ring-amber-100 animate-bounce-slow">
          <img src={APP_LOGO} alt="AI LUXE" className="w-16 h-16 rounded-2xl" />
        </div>

        {/* Welcome Text */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Welcome to AI LUXE
          </h1>
          <p className="text-xl text-amber-800/80 font-medium">
            Time is the Real Luxury
          </p>
        </div>

        {/* Loading Indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "0ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "150ms" }}></div>
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" style={{ animationDelay: "300ms" }}></div>
        </div>

        <p className="text-sm text-amber-700/60 animate-pulse">
          Preparing your luxury experience...
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
