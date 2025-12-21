import React from 'react';
import { Link } from 'react-router-dom';

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-blue-600" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const SignIn: React.FC = () => {
    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-white">
            
            {/* Left Side: Image/Branding */}
            <div className="hidden lg:relative lg:block bg-blue-900 overflow-hidden">
                 <div className="absolute inset-0">
                    <img 
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=2070" 
                        alt="Law Office" 
                        className="w-full h-full object-cover opacity-30 mix-blend-overlay"
                    />
                </div>
                <div className="relative h-full flex flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <span className="text-white"><LogoIcon /></span>
                        </div>
                        <span className="font-bold text-xl tracking-tight">Lex & Partners</span>
                    </div>
                    <div>
                         <blockquote className="text-2xl font-serif font-light leading-relaxed mb-6">
                            "A lawyer with his briefcase can steal more than a hundred men with guns."
                        </blockquote>
                        <cite className="block font-semibold not-italic text-blue-200">— Mario Puzo</cite>
                    </div>
                    <div className="text-sm text-blue-200">
                        &copy; {new Date().getFullYear()} Lex & Partners. Legal excellence since 1998.
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex items-center justify-center p-8 sm:p-12 lg:p-16">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
                        <p className="mt-2 text-slate-500">
                            Please enter your details to sign in.
                        </p>
                    </div>

                    <form className="mt-8 space-y-6">
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email address</label>
                                <input 
                                    id="email" 
                                    name="email" 
                                    type="email" 
                                    autoComplete="email" 
                                    required 
                                    className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="name@company.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">Password</label>
                                <input 
                                    id="password" 
                                    name="password" 
                                    type="password" 
                                    autoComplete="current-password" 
                                    required 
                                    className="mt-1 block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input 
                                    id="remember-me" 
                                    name="remember-me" 
                                    type="checkbox" 
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                                    Remember for 30 days
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:-translate-y-0.5"
                        >
                            Sign in
                        </button>
                        
                        <div className="text-center mt-4">
                            <p className="text-sm text-slate-500">
                                Don't have an account?{' '}
                                <a href="#" className="font-bold text-blue-600 hover:text-blue-500">Sign up</a>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
