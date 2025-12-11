"use client";

import { Report } from "@/types/report";
import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/api";
import {
  DollarSign,
  Users,
  TrendingDown,
  Image as ImageIcon,
  Video,
  Loader2,
  FileText,
  Building2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { MediaViewerDialog } from "./media-viewer-dialog";

interface ReportsListAllProps {
  reports: InfiniteData<PaginatedResponse<Report>> | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export function ReportsListAll({
  reports,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: ReportsListAllProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [mediaViewerOpen, setMediaViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<{
    url: string;
    type: "image" | "video";
    businessName?: string;
  } | null>(null);

  const openMediaViewer = (
    url: string,
    type: "image" | "video",
    businessName?: string
  ) => {
    setSelectedMedia({ url, type, businessName });
    setMediaViewerOpen(true);
  };

  // Infinite scroll observer
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          <p className="text-slate-500 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  const allReports = reports?.pages.flatMap((page) => page.data) || [];
  const totalReports = reports?.pages[0]?.meta.total || 0;

  if (allReports.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-linear-to-br from-slate-50 to-white">
        <CardContent className="p-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No reports yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Submit your first daily report to start tracking performance
          </p>
        </CardContent>
      </Card>
    );
  }

  // Calculate totals
  const totalSales = allReports.reduce(
    (sum, r) => sum + parseFloat(r.sales),
    0
  );
  const totalExpenses = allReports.reduce(
    (sum, r) => sum + parseFloat(r.expenses),
    0
  );
  const totalProfit = totalSales - totalExpenses;

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-emerald-500 to-teal-500 rounded-2xl p-6 shadow-xl shadow-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-emerald-100 text-sm font-medium">Total Sales</p>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${totalSales.toFixed(2)}
          </p>
          <p className="text-emerald-100 text-xs">
            From {allReports.length} reports
          </p>
        </div>

        <div className="bg-linear-to-br from-rose-500 to-pink-500 rounded-2xl p-6 shadow-xl shadow-rose-500/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-rose-100 text-sm font-medium">Total Expenses</p>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${totalExpenses.toFixed(2)}
          </p>
          <p className="text-rose-100 text-xs">{totalReports} total reports</p>
        </div>

        <div className="bg-linear-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-xl shadow-blue-500/20">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 text-sm font-medium">Net Profit</p>
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${totalProfit.toFixed(2)}
          </p>
          <p className="text-blue-100 text-xs">
            {((totalProfit / totalSales) * 100).toFixed(1)}% margin
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {allReports.map((report) => {
          const profit = parseFloat(report.sales) - parseFloat(report.expenses);

          return (
            <Card
              key={report.id}
              className="group relative overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:border-slate-300"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-linear-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              <CardContent className="p-5 relative z-10">
                {/* Business Name */}
                {report.business && (
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-bold text-slate-900 truncate flex-1">
                      {report.business.name}
                    </span>
                  </div>
                )}

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Calendar className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Metrics */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs text-slate-600 font-medium">
                        Sales
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 truncate ml-2">
                      ${parseFloat(report.sales).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50 border border-rose-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <TrendingDown className="w-4 h-4 text-rose-600 shrink-0" />
                      <span className="text-xs text-slate-600 font-medium">
                        Expenses
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 truncate ml-2">
                      ${parseFloat(report.expenses).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <Users className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="text-xs text-slate-600 font-medium">
                        Customers
                      </span>
                    </div>
                    <span className="text-sm font-bold text-slate-900 truncate ml-2">
                      {report.customerCount}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {report.notes && (
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-700 line-clamp-2">
                      {report.notes}
                    </p>
                  </div>
                )}

                {/* Media Links */}
                <div className="flex gap-2 mb-4">
                  {report.imageUrl && (
                    <button
                      onClick={() =>
                        openMediaViewer(
                          report.imageUrl,
                          "image",
                          report.business?.name
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-100 transition"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      View Photo
                    </button>
                  )}
                  {report.videoUrl && (
                    <button
                      onClick={() =>
                        openMediaViewer(
                          report.videoUrl || "",
                          "video",
                          report.business?.name
                        )
                      }
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-100 transition"
                    >
                      <Video className="w-3.5 h-3.5" />
                      View Video
                    </button>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-xs text-slate-500 truncate">
                    ID: #{report.id}
                  </div>
                  <div
                    className={`text-xs font-bold ${
                      profit >= 0 ? "text-emerald-600" : "text-rose-600"
                    } truncate ml-2`}
                  >
                    {profit >= 0 ? "+" : ""}${profit.toFixed(2)}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">
              Loading more...
            </span>
          </div>
        )}
        {!hasNextPage && allReports.length > 0 && (
          <p className="text-sm text-slate-500 font-medium">
            All reports loaded
          </p>
        )}
      </div>

      {/* Media Viewer Dialog */}
      <MediaViewerDialog
        open={mediaViewerOpen}
        onOpenChange={setMediaViewerOpen}
        mediaUrl={selectedMedia?.url || null}
        mediaType={selectedMedia?.type || null}
        businessName={selectedMedia?.businessName}
      />
    </div>
  );
}
