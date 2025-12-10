"use client";

import { Business } from "@/types/business";
import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/api";
import {
  Building2,
  Phone,
  MapPin,
  Tag,
  Loader2,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef } from "react";

interface BusinessListProps {
  businesses: InfiniteData<PaginatedResponse<Business>> | undefined;
  isLoading: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export function BusinessList({
  businesses,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: BusinessListProps) {
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
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Loading businesses...</p>
        </div>
      </div>
    );
  }

  const allBusinesses = businesses?.pages.flatMap((page) => page.data) || [];
  const totalBusinesses = businesses?.pages[0]?.meta.total || 0;

  if (allBusinesses.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <CardContent className="p-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-slate-400" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No businesses yet
          </h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            Get started by adding your first business to the platform
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 shadow-xl shadow-blue-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">
              Total Businesses
            </p>
            <p className="text-4xl font-bold text-white">{totalBusinesses}</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-4">
          Showing {allBusinesses.length} of {totalBusinesses} businesses
        </p>
      </div>

      {/* Business Cards */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {allBusinesses.map((business) => (
          <Card
            key={business.id}
            className="group relative overflow-hidden border border-slate-200 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:border-slate-300"
          >
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

            <CardContent className="p-6 relative z-10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
                    {business.name}
                  </h3>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100">
                    <Tag className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700 truncate max-w-[120px]">
                      {business.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">
                      Owner
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {business.ownerName}
                    </p>
                    <p className="text-xs text-slate-600 truncate">
                      {business.ownerPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 font-medium mb-0.5">
                      Location
                    </p>
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {business.city}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className="truncate">
                  Added {new Date(business.createdAt).toLocaleDateString()}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {isFetchingNextPage && (
          <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <span className="text-sm font-medium text-slate-700">
              Loading more...
            </span>
          </div>
        )}
        {!hasNextPage && allBusinesses.length > 0 && (
          <p className="text-sm text-slate-500 font-medium">
            All businesses loaded
          </p>
        )}
      </div>
    </div>
  );
}
