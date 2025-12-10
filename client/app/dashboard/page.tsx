"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { Building2, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddBusinessDialog } from "@/components/add-business-dialog";
import { BusinessList } from "@/components/business-list";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["businesses"],
    queryFn: ({ pageParam = 1 }) => businessService.list(pageParam, 10),
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
                <Building2 className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Diaspora Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    Manage your businesses
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add Business
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BusinessList
          businesses={data}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          isFetchingNextPage={isFetchingNextPage}
        />
      </main>

      {/* Add Business Dialog */}
      <AddBusinessDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={() => {
          refetch();
          setIsAddDialogOpen(false);
        }}
      />
    </div>
  );
}
