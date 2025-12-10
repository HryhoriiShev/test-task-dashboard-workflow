"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { businessService } from "@/services/business.service";
import { Loader2 } from "lucide-react";
import { AxiosError } from "axios";
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
      queryClient.setQueryData(["businesses"], (old: any) => {
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
      });

      return { previousData };
    },
    onSuccess: (serverBusiness, variables, context) => {
      // Update the infinite query with real server data
      queryClient.setQueryData(["businesses"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any, index: number) => {
            if (index === 0) {
              return {
                ...page,
                data: page.data.map((business: any) =>
                  business.id === context?.previousData
                    ? serverBusiness
                    : business
                ),
              };
            }
            return page;
          }),
        };
      });

      // Also update the simple list query used in report page
      queryClient.setQueryData(["businesses-for-report"], (old: any) => {
        if (!old) return old;
        return [serverBusiness, ...old];
      });

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Business</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Business Name *</Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="Enter business name"
            />
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner Name *</Label>
            <Input
              id="ownerName"
              {...register("ownerName")}
              placeholder="Enter owner name"
            />
            {errors.ownerName && (
              <p className="text-sm text-red-600">{errors.ownerName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Owner Phone *</Label>
            <Input
              id="ownerPhone"
              type="tel"
              {...register("ownerPhone")}
              placeholder="Enter phone number"
            />
            {errors.ownerPhone && (
              <p className="text-sm text-red-600">
                {errors.ownerPhone.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              {...register("category")}
              placeholder="e.g., Restaurant, Retail, Services"
            />
            {errors.category && (
              <p className="text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City *</Label>
            <Input id="city" {...register("city")} placeholder="Enter city" />
            {errors.city && (
              <p className="text-sm text-red-600">{errors.city.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1"
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
