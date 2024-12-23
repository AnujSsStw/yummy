"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/Cooking.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video for readability */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50 z-1"></div>

      {/* Hero Section */}
      <div className="relative text-center px-6 z-10 mt-10 md:mt-0">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          Welcome to <span className="text-white">Yummy Hub</span>
        </h1>
        <p className="mt-2 text-sm md:text-lg text-white">
          Discover delicious recipes, save your favorites, and get cooking!
        </p>
      </div>

      {/* Login Card */}
      <div className="z-10 bg-white/90 shadow-lg rounded-lg p-6 md:p-8 max-w-sm w-full text-center mt-8 md:mt-10">
        <h2 className="text-2xl font-bold mb-4 text-secondary">
          Sign In to <span className="text-primary">Yummy Hub</span>
        </h2>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          <img src="/google-solid-sharp.svg" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
        <p className="mt-4 text-xs text-gray-500">
          By signing in, you agree to our{" "}
          <a href="#" className="text-primary underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
