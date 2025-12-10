"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { Loader2, Building2 } from "lucide-react";
import { AxiosError } from "axios";
import { Business } from "@/types/business";
import { PaginatedResponse } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Validation schema
const businessSchema = z.object({
  name: z.string().min(1, "Business name is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  ownerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  category: z.string().min(1, "Category is required"),
  city: z.string().min(1, "City is required"),
});

type BusinessFormData = z.infer<typeof businessSchema>;

interface AddBusinessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddBusinessDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddBusinessDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
  });

  const mutation = useMutation({
    mutationFn: businessService.create,
    onMutate: async (newBusiness) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["businesses"] });

      // Optimistically update cache
      const previousData = queryClient.getQueryData(["businesses"]);

      // Show optimistic business immediately
      queryClient.setQueryData(
        ["businesses"],
        (old: InfiniteData<PaginatedResponse<Business>> | undefined) => {
          if (!old) return old;
          const optimisticBusiness = {
            ...newBusiness,
            id: Date.now(), // temporary ID
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                data: [optimisticBusiness, ...old.pages[0].data],
                meta: {
                  ...old.pages[0].meta,
                  total: old.pages[0].meta.total + 1,
                },
              },
              ...old.pages.slice(1),
            ],
          };
        }
      );

      return { previousData };
    },
    onSuccess: (serverBusiness, variables, context) => {
      // Update the infinite query with real server data
      queryClient.setQueryData(
        ["businesses"],
        (old: InfiniteData<PaginatedResponse<Business>> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page, index) => {
              if (index === 0) {
                return {
                  ...page,
                  data: page.data.map((business) =>
                    business.id === context?.previousData
                      ? serverBusiness
                      : business
                  ),
                };
              }
              return page;
            }),
          };
        }
      );

      // Also update the simple list query used in report page
      queryClient.setQueryData(
        ["businesses-for-report"],
        (old: Business[] | undefined) => {
          if (!old) return old;
          return [serverBusiness, ...old];
        }
      );

      reset();
      setError(null);
      onSuccess();
    },
    onError: (err: unknown, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["businesses"], context.previousData);
      }

      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Failed to create business");
      } else {
        setError("Failed to create business");
      }
    },
  });

  const onSubmit = (data: BusinessFormData) => {
    setError(null);
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-linear-to-br from-white to-slate-50 border-slate-200">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Add New Business
              </DialogTitle>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Register a new business to the platform
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-2">
          {error && (
            <div className="bg-linear-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-red-600">!</span>
              </div>
              <p className="text-sm flex-1">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-semibold text-slate-700"
            >
              Business Name *
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter business name"
              className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
            />
            {errors.name && (
              <p className="text-xs text-red-600 font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="ownerName"
                className="text-sm font-semibold text-slate-700"
              >
                Owner Name *
              </Label>
              <Input
                id="ownerName"
                {...register("ownerName")}
                placeholder="John Doe"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.ownerName && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.ownerName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="ownerPhone"
                className="text-sm font-semibold text-slate-700"
              >
                Owner Phone *
              </Label>
              <Input
                id="ownerPhone"
                type="tel"
                {...register("ownerPhone")}
                placeholder="+1234567890"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.ownerPhone && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.ownerPhone.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-slate-700"
              >
                Category *
              </Label>
              <Input
                id="category"
                {...register("category")}
                placeholder="Restaurant"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.category && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-semibold text-slate-700"
              >
                City *
              </Label>
              <Input
                id="city"
                {...register("city")}
                placeholder="New York"
                className="border-slate-200 focus:border-blue-500 focus:ring-blue-500/20"
              />
              {errors.city && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.city.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-slate-200 hover:bg-slate-50"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {mutation.isPending ? "Creating..." : "Create Business"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
