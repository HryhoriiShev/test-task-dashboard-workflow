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
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";

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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  const allReports = reports?.pages.flatMap((page) => page.data) || [];
  const totalReports = reports?.pages[0]?.meta.total || 0;

  if (allReports.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No reports yet
          </h3>
          <p className="text-gray-500">
            Click "Submit Report" to create your first report
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600">
            Showing {allReports.length} of {totalReports} reports
          </p>
        </CardContent>
      </Card>

      {/* Reports Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {allReports.map((report) => (
          <Card key={report.id} className="hover:shadow-md transition">
            <CardContent className="p-6">
              {/* Business Name */}
              {report.business && (
                <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-900">
                    {report.business.name}
                  </span>
                </div>
              )}

              {/* Date */}
              <div className="text-sm text-gray-500 mb-4">
                {new Date(report.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>

              {/* Metrics */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-600">Sales</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${parseFloat(report.sales).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-red-600" />
                    <span className="text-xs text-gray-600">Expenses</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ${parseFloat(report.expenses).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-gray-600">Customers</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    {report.customerCount}
                  </span>
                </div>
              </div>

              {/* Notes */}
              {report.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {report.notes}
                  </p>
                </div>
              )}

              {/* Media Links */}
              <div className="flex gap-2 mb-4">
                {report.imageUrl && (
                  <a
                    href={report.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition"
                  >
                    <ImageIcon className="w-3 h-3" />
                    Photo
                  </a>
                )}
                {report.videoUrl && (
                  <a
                    href={report.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-50 text-purple-700 rounded hover:bg-purple-100 transition"
                  >
                    <Video className="w-3 h-3" />
                    Video
                  </a>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="text-xs text-gray-500">ID: #{report.id}</div>
                <div className="text-xs font-medium text-green-600">
                  Profit: $
                  {(
                    parseFloat(report.sales) - parseFloat(report.expenses)
                  ).toFixed(2)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 animate-spin text-green-600" />
        )}
        {!hasNextPage && allReports.length > 0 && (
          <p className="text-sm text-gray-500">No more reports to load</p>
        )}
      </div>
    </div>
  );
}
