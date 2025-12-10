"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { Business } from "@/types/business";
import { Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AxiosError } from "axios";

// Validation schema
const reportSchema = z.object({
  businessId: z.number().min(1, "Please select a business"),
  sales: z.number().min(0, "Sales must be a positive number"),
  expenses: z.number().min(0, "Expenses must be a positive number"),
  customerCount: z
    .number()
    .int()
    .min(0, "Customer count must be a positive number"),
  notes: z.string().optional(),
  image: z
    .any()
    .refine((files) => files && files.length > 0, "Image is required")
    .refine(
      (files) => !files || files[0]?.size <= 5000000,
      "Max file size is 5MB"
    ),
  video: z
    .any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 50000000,
      "Max video size is 50MB"
    ),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface SubmitReportFormProps {
  businesses: Business[];
  onSuccess: () => void;
  onBusinessSelect: (businessId: number) => void;
}

export function SubmitReportForm({
  businesses,
  onSuccess,
  onBusinessSelect,
}: SubmitReportFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  const businessId = watch("businessId");

  const handleBusinessChange = (value: string) => {
    const id = parseInt(value);
    setValue("businessId", id);
    onBusinessSelect(id);
  };

  const mutation = useMutation({
    mutationFn: reportService.create,
    onMutate: async (newReport) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["reports", newReport.businessId],
      });

      // Optimistically update cache
      queryClient.setQueryData(
        ["reports", newReport.businessId],
        (old: any) => {
          if (!old) return old;

          const optimisticReport = {
            id: Date.now(),
            sales: newReport.sales.toString(),
            expenses: newReport.expenses.toString(),
            customerCount: newReport.customerCount,
            notes: newReport.notes || null,
            imageUrl: imagePreview || "",
            videoUrl: videoPreview || null,
            businessId: newReport.businessId,
            createdAt: new Date().toISOString(),
          };

          return {
            ...old,
            pages: [
              {
                ...old.pages[0],
                data: [optimisticReport, ...old.pages[0].data],
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
    },
    onSuccess: () => {
      reset();
      setError(null);
      setImagePreview(null);
      setVideoPreview(null);
      onSuccess();
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Failed to submit report");
      } else {
        setError("Failed to submit report");
      }
    },
    onSettled: (serverReport, _error, variables) => {
      // Only update with real server data, no refetch
      if (serverReport) {
        queryClient.setQueryData(
          ["reports", variables.businessId],
          (old: any) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page: any, index: number) => {
                if (index === 0) {
                  return {
                    ...page,
                    data: page.data.map((report: any) =>
                      report.id === Date.now() ? serverReport : report
                    ),
                  };
                }
                return page;
              }),
            };
          }
        );
      }
    },
  });

  const onSubmit = (data: ReportFormData) => {
    setError(null);
    const reportData = {
      ...data,
      image: data.image[0],
      video: data.video?.[0],
    };
    mutation.mutate(reportData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Submit Daily Report
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="businessId">Select Business *</Label>
          <Controller
            name="businessId"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value));
                  handleBusinessChange(value);
                }}
                value={field.value?.toString()}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a business" />
                </SelectTrigger>
                <SelectContent>
                  {businesses.length === 0 ? (
                    <div className="p-4 text-sm text-gray-500 text-center">
                      No businesses available. Add one from the dashboard.
                    </div>
                  ) : (
                    businesses.map((business) => (
                      <SelectItem
                        key={business.id}
                        value={business.id.toString()}
                      >
                        {business.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.businessId && (
            <p className="text-sm text-red-600">{errors.businessId.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sales">Sales ($) *</Label>
            <Input
              id="sales"
              {...register("sales", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
            {errors.sales && (
              <p className="text-sm text-red-600">{errors.sales.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenses">Expenses ($) *</Label>
            <Input
              id="expenses"
              {...register("expenses", { valueAsNumber: true })}
              type="number"
              step="0.01"
              placeholder="0.00"
            />
            {errors.expenses && (
              <p className="text-sm text-red-600">{errors.expenses.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerCount">Customer Count *</Label>
          <Input
            id="customerCount"
            {...register("customerCount", { valueAsNumber: true })}
            type="number"
            placeholder="0"
          />
          {errors.customerCount && (
            <p className="text-sm text-red-600">
              {errors.customerCount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            {...register("notes")}
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Any additional notes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo *
          </label>
          <div className="mt-1">
            {!imagePreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-400 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photo</p>
                </div>
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setImagePreview(null);
                    setValue("image", null);
                  }}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
          {errors.image && (
            <p className="text-sm text-red-600 mt-1">
              {errors.image.message as string}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Video (Optional)
          </label>
          <div className="mt-1">
            {!videoPreview ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-green-400 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload video</p>
                </div>
                <input
                  {...register("video")}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoChange}
                />
              </label>
            ) : (
              <div className="relative">
                <video
                  src={videoPreview}
                  className="w-full h-48 rounded-lg"
                  controls
                />
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  onClick={() => {
                    setVideoPreview(null);
                    setValue("video", null);
                  }}
                  className="absolute top-2 right-2 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {mutation.isPending && (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          )}
          {mutation.isPending ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </div>
  );
}
