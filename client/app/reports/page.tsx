"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { businessService } from "@/services/business.service";
import { FileText, Plus, ArrowLeft, Filter, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitReportDialog } from "@/components/submit-report-dialog";
import { ReportsListAll } from "@/components/reports-list-all";

export default function ReportsPage() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState<number | null>(
    null
  );

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
    queryKey: ["reports", selectedBusinessId],
    queryFn: ({ pageParam = 1 }) =>
      selectedBusinessId
        ? reportService.listByBusiness(selectedBusinessId, pageParam, 12)
        : reportService.list(pageParam, 12),
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
    initialPageParam: 1,
  });

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
      <div className="bg-white/60 backdrop-blur-lg border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100">
              <Filter className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-semibold text-slate-700">
                Filter
              </span>
            </div>
            <div className="flex-1 max-w-xs">
              <Select
                value={selectedBusinessId?.toString() || "all"}
                onValueChange={(value) =>
                  setSelectedBusinessId(
                    value === "all" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger className="bg-white border-slate-200 hover:border-slate-300 transition">
                  <SelectValue placeholder="Filter by business" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Businesses</SelectItem>
                  {businessesData?.map((business) => (
                    <SelectItem
                      key={business.id}
                      value={business.id.toString()}
                    >
                      {business.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedBusinessId && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedBusinessId(null)}
                className="border-slate-200 hover:bg-slate-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            )}
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
