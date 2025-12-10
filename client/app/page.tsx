import Link from "next/link";
import { Building2, FileText } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to OvaSight
          </h1>
          <p className="text-xl text-gray-600">Choose your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Diaspora Dashboard */}
          <Link href="/dashboard">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-blue-500">
              <div className="flex flex-col items-center text-center">
                <div className="bg-blue-100 p-6 rounded-full mb-4">
                  <Building2 className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Diaspora Dashboard
                </h2>
                <p className="text-gray-600 mb-4">
                  Manage businesses and view all reports
                </p>
                <div className="text-sm text-blue-600 font-semibold">
                  Enter Dashboard →
                </div>
              </div>
            </div>
          </Link>

          {/* Business Owner Portal */}
          <Link href="/reports">
            <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all cursor-pointer border-2 border-transparent hover:border-green-500">
              <div className="flex flex-col items-center text-center">
                <div className="bg-green-100 p-6 rounded-full mb-4">
                  <FileText className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Business Owner
                </h2>
                <p className="text-gray-600 mb-4">
                  Submit and view daily reports for your business
                </p>
                <div className="text-sm text-green-600 font-semibold">
                  Submit Report →
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
