"use client";

import { Business } from "@/types/business";
import { InfiniteData } from "@tanstack/react-query";
import { PaginatedResponse } from "@/types/api";
import { Building2, Phone, MapPin, Tag, Loader2 } from "lucide-react";
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
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const allBusinesses = businesses?.pages.flatMap((page) => page.data) || [];
  const totalBusinesses = businesses?.pages[0]?.meta.total || 0;

  if (allBusinesses.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No businesses yet
          </h3>
          <p className="text-gray-500">
            Click "Add Business" to create your first business
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
            Showing {allBusinesses.length} of {totalBusinesses} businesses
          </p>
        </CardContent>
      </Card>

      {/* Business Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {allBusinesses.map((business) => (
          <Card key={business.id} className="hover:shadow-md transition">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {business.name}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{business.ownerName}</span>
                      <span className="text-gray-400">•</span>
                      <span>{business.ownerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Tag className="w-4 h-4" />
                      <span>{business.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{business.city}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-400">
                    Added {new Date(business.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        )}
        {!hasNextPage && allBusinesses.length > 0 && (
          <p className="text-sm text-gray-500">No more businesses to load</p>
        )}
      </div>
    </div>
  );
}
