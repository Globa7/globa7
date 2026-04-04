import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Loader2 } from "lucide-react";

export function EventFlowLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      navigate("/eventflow");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#D4AF37] rounded-2xl mb-4">
            <span className="text-black font-bold text-3xl">G7</span>
          </div>
          <h1 
            className="text-4xl font-bold text-white mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Globa7 EventFlow Portal
          </h1>
          <p className="text-gray-400">
            Multi-Event Dispatch System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#1A1A1A] border border-[#D4AF37]/20 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@globa7.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-black border-[#D4AF37]/30 text-white focus:border-[#D4AF37]"
                required
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-[#D4AF37]/30 bg-black text-[#D4AF37] focus:ring-[#D4AF37]"
                />
                Remember me
              </label>
              <button
                type="button"
                className="text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90 font-semibold py-6 text-lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#D4AF37]/20">
            <button className="w-full text-center text-sm text-gray-400 hover:text-[#D4AF37] transition-colors">
              Request Access
              <span className="block text-xs mt-1">For SaaS clients and partners</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-500 text-sm mt-8">
          © 2026 Globa7 Transportation. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}
