"use client";

import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { businessService } from "@/services/business.service";
import { FileText, Plus, ArrowLeft, Filter } from "lucide-react";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Daily Reports
                  </h1>
                  <p className="text-sm text-gray-500">
                    View and manage all reports
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsSubmitDialogOpen(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submit Report
            </Button>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex-1 max-w-xs">
              <Select
                value={selectedBusinessId?.toString() || "all"}
                onValueChange={(value) =>
                  setSelectedBusinessId(
                    value === "all" ? null : parseInt(value)
                  )
                }
              >
                <SelectTrigger>
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
              >
                Clear Filter
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
