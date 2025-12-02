import { SignIn } from "@clerk/clerk-react";
import { APP_LOGO } from "@/const";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="mb-8 text-center">
        <img src={APP_LOGO} alt="AI LUXE" className="h-16 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900">Welcome to AI LUXE</h1>
        <p className="text-gray-600 mt-2">Time is the Real Luxury</p>
      </div>
      <SignIn 
        routing="path" 
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
