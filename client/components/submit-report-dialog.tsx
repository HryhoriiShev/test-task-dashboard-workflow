"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";
import { reportService } from "@/services/report.service";
import { Business } from "@/types/business";
import { Report } from "@/types/report";
import { PaginatedResponse } from "@/types/api";
import Image from "next/image";
import {
  Loader2,
  Upload,
  X,
  FileText,
  DollarSign,
  Users,
  TrendingDown,
  Image as ImageIcon,
  Video,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AxiosError } from "axios";

// Validation schema - simplified without file validation
const reportSchema = z.object({
  businessId: z.number().min(1, "Please select a business"),
  sales: z.number().min(0, "Sales must be a positive number"),
  expenses: z.number().min(0, "Expenses must be a positive number"),
  customerCount: z
    .number()
    .int()
    .min(0, "Customer count must be a positive number"),
  notes: z.string().optional(),
});

type ReportFormData = z.infer<typeof reportSchema>;

interface SubmitReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businesses: Business[];
  onSuccess: () => void;
}

export function SubmitReportDialog({
  open,
  onOpenChange,
  businesses,
  onSuccess,
}: SubmitReportDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ReportFormData>({
    resolver: zodResolver(reportSchema),
  });

  // Clear form when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      reset();
      setError(null);
      setImagePreview(null);
      setVideoPreview(null);
      setImageFile(null);
      setVideoFile(null);
    }
    onOpenChange(isOpen);
  };

  const mutation = useMutation({
    mutationFn: reportService.create,
    onMutate: async (newReport) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["reports"],
      });

      // Optimistically update cache
      queryClient.setQueryData(
        ["reports"],
        (old: InfiniteData<PaginatedResponse<Report>> | undefined) => {
          if (!old) return old;

          const optimisticReport: Report = {
            id: Date.now(),
            sales: newReport.sales.toString(),
            expenses: newReport.expenses.toString(),
            customerCount: newReport.customerCount,
            notes: newReport.notes || null,
            imageUrl: imagePreview || "",
            videoUrl: videoPreview || null,
            businessId: newReport.businessId,
            business: businesses.find((b) => b.id === newReport.businessId),
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
      setImageFile(null);
      setVideoFile(null);
      onSuccess();
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.error || "Failed to submit report");
      } else {
        setError("Failed to submit report");
      }
    },
  });

  const onSubmit = (data: ReportFormData) => {
    // Validate image file separately
    if (!imageFile) {
      setError("Please upload an image");
      return;
    }

    setError(null);
    const reportData = {
      ...data,
      image: imageFile,
      video: videoFile || undefined,
    };
    mutation.mutate(reportData);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB max)
      if (file.size > 5000000) {
        setError("Image file size must be less than 5MB");
        return;
      }

      setImageFile(file);
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
      // Check file size (50MB max)
      if (file.size > 50000000) {
        setError("Video file size must be less than 50MB");
        return;
      }

      setVideoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-linear-to-br from-white to-slate-50 border-slate-200">
        <DialogHeader className="pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Submit Daily Report
              </DialogTitle>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Record today&apos;s business performance
              </p>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
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
              htmlFor="businessId"
              className="text-sm font-semibold text-slate-700"
            >
              Select Business *
            </Label>
            <Controller
              name="businessId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(parseInt(value));
                  }}
                  value={field.value?.toString()}
                >
                  <SelectTrigger className="w-full border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20">
                    <SelectValue placeholder="Choose a business" />
                  </SelectTrigger>
                  <SelectContent>
                    {businesses.length === 0 ? (
                      <div className="p-4 text-sm text-slate-500 text-center">
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
              <p className="text-xs text-red-600 font-medium">
                {errors.businessId.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="sales"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4 text-emerald-600" />
                Sales ($) *
              </Label>
              <Input
                id="sales"
                {...register("sales", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              {errors.sales && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.sales.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="expenses"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <TrendingDown className="w-4 h-4 text-rose-600" />
                Expenses ($) *
              </Label>
              <Input
                id="expenses"
                {...register("expenses", { valueAsNumber: true })}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              {errors.expenses && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.expenses.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="customerCount"
                className="text-sm font-semibold text-slate-700 flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-blue-600" />
                Customers *
              </Label>
              <Input
                id="customerCount"
                {...register("customerCount", { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
              />
              {errors.customerCount && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.customerCount.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="notes"
              className="text-sm font-semibold text-slate-700"
            >
              Notes (Optional)
            </Label>
            <textarea
              id="notes"
              {...register("notes")}
              rows={3}
              className="flex min-h-[80px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus:border-emerald-500 transition"
              placeholder="Add any additional notes about today's business..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Photo *
              </Label>
              {!imagePreview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Upload photo
                    </p>
                    <p className="text-xs text-slate-500">Max 5MB (JPG, PNG)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative group">
                  <Image
                      src={imagePreview}
                      width={160}
                      height={160}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-xl border-2 border-slate-200"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                      }}
                      className="h-10 w-10 shadow-lg"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                Video (Optional)
              </Label>
              {!videoPreview ? (
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer hover:border-purple-400 hover:bg-purple-50/50 transition-all group">
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-12 h-12 rounded-xl bg-linear-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-3 group-hover:scale-110 transition">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 mb-1">
                      Upload video
                    </p>
                    <p className="text-xs text-slate-500">
                      Max 50MB (MP4, MOV)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoChange}
                  />
                </label>
              ) : (
                <div className="relative group">
                  <video
                    src={videoPreview}
                    className="w-full h-40 rounded-xl border-2 border-slate-200 object-cover"
                    controls
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFile(null);
                      }}
                      className="h-8 w-8 shadow-lg opacity-90 hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="flex-1 border-slate-200 hover:bg-slate-50"
              disabled={mutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/30"
            >
              {mutation.isPending && (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              )}
              {mutation.isPending ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
