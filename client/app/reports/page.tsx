"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { businessService } from "@/services/business.service";
import { FileText, Plus, ArrowLeft, Filter, X, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SubmitReportDialog } from "@/components/submit-report-dialog";
import { ReportsListAll } from "@/components/reports-list-all";

export default function ReportsPage() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedBusinessIds, setSelectedBusinessIds] = useState<number[]>([]);

  // Fetch businesses for filter and form
  const { data: businessesData } = useQuery({
    queryKey: ["businesses-for-report"],
    queryFn: async () => {
      const response = await businessService.list(1, 100);
      return response.data;
    },
  });

  // Fetch reports with optional business filter
  const {
    data: reports,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["reports", selectedBusinessIds],
    queryFn: async ({ pageParam = 1 }) => {
      if (selectedBusinessIds.length === 0) {
        return reportService.list(pageParam, 12);
      }

      // Fetch reports for all selected businesses and combine them
      const allReports = await Promise.all(
        selectedBusinessIds.map((id) =>
          reportService.listByBusiness(id, pageParam, 12)
        )
      );

      // Combine and sort by date
      const combinedData = allReports.flatMap((r) => r.data);
      combinedData.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      return {
        data: combinedData,
        meta: {
          total: allReports.reduce((sum, r) => sum + r.meta.total, 0),
          page: pageParam,
          limit: 12,
          totalPages: Math.max(...allReports.map((r) => r.meta.totalPages)),
        },
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    initialPageParam: 1,
  });

  const toggleBusiness = (businessId: number) => {
    setSelectedBusinessIds((prev) =>
      prev.includes(businessId)
        ? prev.filter((id) => id !== businessId)
        : [...prev, businessId]
    );
  };

  const clearAllFilters = () => {
    setSelectedBusinessIds([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="group flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900 transition" />
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                    Daily Reports
                  </h1>
                  <p className="text-sm text-slate-500 font-medium">
                    Track and analyze business performance
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Report
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="space-y-3">
            {/* Filter Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-semibold text-slate-700">
                  Filter by Business
                </span>
                {selectedBusinessIds.length > 0 && (
                  <span className="text-xs text-slate-500">
                    ({selectedBusinessIds.length} selected)
                  </span>
                )}
              </div>
              {selectedBusinessIds.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllFilters}
                  className="h-7 text-xs hover:bg-slate-100"
                >
                  Clear all
                </Button>
              )}
            </div>

            {/* Business Chips */}
            <div className="flex flex-wrap gap-2">
              {businessesData?.map((business) => {
                const isSelected = selectedBusinessIds.includes(business.id);
                return (
                  <button
                    key={business.id}
                    onClick={() => toggleBusiness(business.id)}
                    className={`
                      inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl"
                          : "bg-white border border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                      }
                    `}
                  >
                    <Building2
                      className={`w-3.5 h-3.5 ${
                        isSelected ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span className="truncate max-w-[150px]">
                      {business.name}
                    </span>
                    {isSelected && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </button>
                );
              })}

              {(!businessesData || businessesData.length === 0) && (
                <div className="text-sm text-slate-500 py-2">
                  No businesses available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReportsListAll
          reports={reports}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </main>

      {/* Submit Report Dialog */}
      <SubmitReportDialog
        open={isSubmitDialogOpen}
        onOpenChange={setIsSubmitDialogOpen}
        businesses={businessesData || []}
        onSuccess={() => {
          refetch();
          setIsSubmitDialogOpen(false);
        }}
      />
    </div>
  );
}
