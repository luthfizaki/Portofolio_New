import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import { apiUrl } from "../../src/lib/apiBase";
import { requestJson } from "../../src/lib/requestJson";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { res, data } = await requestJson<any>(apiUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("cms_token", data.token);
      localStorage.setItem("cms_user", data.username);
      navigate("/cms/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#2B7FFF]/5 rounded-full blur-[200px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#5C32FF]/5 rounded-full blur-[180px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#2B7FFF 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2B7FFF] to-[#5C32FF] flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(43,127,255,0.3)]">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-wide">Portfolio CMS</h1>
          <p className="text-[#8B9DBB] text-sm mt-1 font-light">Sign in to manage your portfolio</p>
        </div>

        {/* Login Card */}
        <form onSubmit={handleLogin} className="bg-[#060A14]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-5">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#8B9DBB] text-xs font-mono uppercase tracking-wider">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DBB]/50" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-[#0A1128] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#2B7FFF]/50 focus:ring-1 focus:ring-[#2B7FFF]/20 transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[#8B9DBB] text-xs font-mono uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B9DBB]/50" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-[#0A1128] border border-white/10 rounded-xl pl-10 pr-12 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#2B7FFF]/50 focus:ring-1 focus:ring-[#2B7FFF]/20 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8B9DBB]/50 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-[#2B7FFF] to-[#5C32FF] text-white font-medium py-3 rounded-xl hover:shadow-[0_0_25px_rgba(43,127,255,0.3)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm tracking-wide"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>
        </form>

        <p className="text-center text-[#8B9DBB]/40 text-xs mt-6 font-mono">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}
