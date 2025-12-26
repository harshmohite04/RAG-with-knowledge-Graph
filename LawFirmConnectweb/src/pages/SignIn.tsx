import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';


// ... icons ...

const LogoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-blue-600" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const EyeIcon = () => (
    <svg className="w-5 h-5 text-slate-400 cursor-pointer hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
)

const LockIcon = () => (
    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
)

const ShieldIcon = () => (
    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
)

const SignIn: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await authService.login(formData.email, formData.password);
            navigate('/portal');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-14">
            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden grid lg:grid-cols-2 min-h-[600px]">
            
                {/* Left Side: Form */}
                 <div className="flex flex-col p-8 sm:p-12 lg:p-16 overflow-y-auto">
                    {/* Branding */}
                    <div className="flex items-center gap-2 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="bg-blue-50 p-1.5 rounded-lg">
                           <LogoIcon />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">Lex & Partners</span>
                    </div>

                    <div className="flex-grow flex flex-col justify-center w-full mx-auto">
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Secure Client Access</h1>
                        <p className="text-slate-500 text-sm leading-relaxed mb-8">
                            Welcome back. Please log in to access your case files, secure messaging, and billing information.
                        </p>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-slate-900 mb-1.5">Email Address / Username</label>
                                    <input 
                                        id="email" 
                                        name="email" 
                                        type="email" 
                                        autoComplete="email" 
                                        required 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        placeholder="e.g. name@example.com"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-xs font-bold text-slate-900 mb-1.5">Password</label>
                                    <div className="relative">
                                        <input 
                                            id="password" 
                                            name="password" 
                                            type={showPassword ? "text" : "password"} 
                                            autoComplete="current-password" 
                                            required 
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="block w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-12"
                                            placeholder="Enter your password"
                                        />
                                        <div 
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            <EyeIcon />
                                        </div>
                                    </div>
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
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-500">
                                        Remember my device
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Logging In...' : (
                                    <>
                                        <LockIcon /> Secure Login
                                    </>
                                )}
                            </button>
                            
                            <div className="text-center mt-6">
                                <p className="text-sm text-slate-500">
                                    First time here? <a href="/signup" className="font-bold text-blue-600 hover:text-blue-700">Activate your account</a>
                                </p>
                            </div>
                        </form>

                        <hr className="my-8 border-slate-100" />
                        
                        <div className="flex flex-col gap-2">
                             <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 tracking-wider">
                                <ShieldIcon />
                                 256-BIT SSL SECURE CONNECTION
                             </div>
                             <p className="text-[10px] text-slate-400 leading-normal">
                                 Unauthorized access is prohibited. All activity is monitored and logged for security purposes. By logging in, you agree to our <a href="#" className="underline hover:text-slate-500">Terms of Service</a> and <a href="#" className="underline hover:text-slate-500">Privacy Policy</a>.
                             </p>
                        </div>

                    </div>
                </div>

                {/* Right Side: Image/Branding */}
                <div className="hidden lg:relative lg:block bg-slate-900 overflow-hidden">
                     <div className="absolute inset-0">
                        <img 
                            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069" 
                            alt="Modern Office" 
                            className="w-full h-full object-cover opacity-40"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="relative h-full flex flex-col justify-end p-16">
                        <div className="mb-8">
                            <span className="inline-block px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-slate-300 mb-4 backdrop-blur-sm">
                                CLIENT PORTAL V2.0
                            </span>
                            <h2 className="text-2xl font-bold text-white leading-tight mb-4 tracking-tight">
                                "Dedicated to protecting what matters most to you through secure and transparent legal counsel."
                            </h2>
                             <div className="w-12 h-1 bg-blue-600 rounded-full mb-6"></div>
                             <div>
                                 <p className="text-white font-semibold">Expert Legal Support</p>
                                 <p className="text-slate-400 text-sm">Available 24/7 for critical case updates</p>
                             </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SignIn;
