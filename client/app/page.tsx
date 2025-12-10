import Link from "next/link";
import { Building2, FileText, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      <div className="max-w-6xl mx-auto p-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300 font-medium">
              Modern Business Intelligence Platform
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-white">
            Welcome to OvaSight
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Streamline your business operations with intelligent reporting and
            real-time insights
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Diaspora Dashboard */}
          <Link href="/dashboard">
            <div className="group relative bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 flex flex-col items-start text-left h-full">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl mb-6 shadow-lg shadow-blue-500/50">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Diaspora Dashboard
                </h2>
                <p className="text-slate-300 mb-6 flex-grow">
                  Comprehensive business management with advanced analytics and
                  reporting capabilities
                </p>
                <div className="inline-flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Business Owner Portal */}
          <Link href="/reports">
            <div className="group relative bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-8 border border-emerald-500/20 hover:border-emerald-400/40 transition-all duration-300 cursor-pointer overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <div className="relative z-10 flex flex-col items-start text-left h-full">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-2xl mb-6 shadow-lg shadow-emerald-500/50">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Business Owner
                </h2>
                <p className="text-slate-300 mb-6 flex-grow">
                  Submit daily reports and track your business performance with
                  real-time metrics
                </p>
                <div className="inline-flex items-center gap-2 text-emerald-400 font-semibold group-hover:gap-3 transition-all">
                  <span>Submit Report</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
