import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Mail, Lock, User, Phone, ArrowRight, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import logoImage from "@/assets/bc5f3d72095ff495d66f7beeae6ceec35d5b87b0.png";

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@globa7.com",
    password: "admin123",
    name: "",
    phone: "",
  });

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(
          formData.email,
          formData.password,
          formData.name,
          formData.phone,
        );
        toast.success("Welcome to Globa7!", {
          description:
            "Your account has been created successfully.",
        });
        // New users are always clients
        navigate("/portal");
      } else {
        const user = await signIn(
          formData.email,
          formData.password,
        );
        toast.success("Welcome back!", {
          description: "You have been signed in successfully.",
        });
        // Redirect based on user role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/portal");
        }
      }
    } catch (error: any) {
      toast.error("Authentication Failed", {
        description:
          error.message ||
          "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent_50%)]" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37] rounded-full blur-3xl opacity-20"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[#D4AF37] hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm uppercase tracking-wider">
            Back to Home
          </span>
        </motion.button>

        {/* Auth Card */}
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl border border-[#D4AF37]/20 rounded-lg p-8 shadow-2xl shadow-[#D4AF37]/10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 flex items-center justify-center mb-4">
              <img src={logoImage} alt="Globa7 Logo" className="w-full h-full object-contain" />
            </div>
            <h1
              className="text-3xl font-bold text-white tracking-wider mb-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              GLOBA7
            </h1>
            <div className="flex items-center gap-2 text-[#D4AF37] text-sm">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-widest">
                Luxury Transportation
              </span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          {/* Toggle */}
          <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-lg">
            <button
              onClick={() => setIsSignUp(false)}
              className={`flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wider transition-all ${
                !isSignUp
                  ? "bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`flex-1 py-3 rounded-md text-sm font-semibold uppercase tracking-wider transition-all ${
                isSignUp
                  ? "bg-gradient-to-r from-[#D4AF37] to-yellow-600 text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <>
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-gray-300"
                  >
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <Input
                      id="name"
                      type="text"
                      required={isSignUp}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="pl-11 bg-black/40 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-gray-300"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                    <Input
                      id="phone"
                      type="tel"
                      required={isSignUp}
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phone: e.target.value,
                        })
                      }
                      className="pl-11 bg-black/40 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                      placeholder="(504) 555-0123"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="pl-11 bg-black/40 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-300"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#D4AF37]" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  className="pl-11 bg-black/40 border-[#D4AF37]/30 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-gold py-6 text-base font-semibold uppercase tracking-wider"
              >
                {loading
                  ? "Processing..."
                  : isSignUp
                    ? "Create Account"
                    : "Sign In"}
              </Button>
            </motion.div>
          </form>

          {/* Footer Text */}
          <p className="text-center text-sm text-gray-400 mt-6">
            {isSignUp
              ? "Already have an account?"
              : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#D4AF37] hover:text-white transition-colors font-semibold"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>

          {!isSignUp && (
            <p className="text-center text-xs text-gray-500 mt-4">
              Demo: admin@globa7.com / admin123 (Admin Access)
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}