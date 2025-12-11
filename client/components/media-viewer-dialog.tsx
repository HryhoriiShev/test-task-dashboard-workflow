"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  X,
  Download,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface MediaViewerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaUrl: string | null;
  mediaType: "image" | "video" | null;
  businessName?: string;
}

export function MediaViewerDialog({
  open,
  onOpenChange,
  mediaUrl,
  mediaType,
  businessName,
}: MediaViewerDialogProps) {
  if (!mediaUrl || !mediaType) return null;

  const handleDownload = () => {
    window.open(mediaUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] bg-slate-950/95 backdrop-blur-2xl border-slate-800 p-0 gap-0">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {mediaType === "image" ? "Photo Viewer" : "Video Player"}
        </DialogTitle>
        {/* Floating Header */}
        <div className="absolute top-0 left-0 right-0 z-50 p-6">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-linear-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-50"></div>
                  <div className="relative w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    {mediaType === "image" ? (
                      <ImageIcon className="w-6 h-6 text-white" />
                    ) : (
                      <Video className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {mediaType === "image" ? "Photo Viewer" : "Video Player"}
                  </h2>
                  {businessName && (
                    <p className="text-sm text-slate-400 font-medium">
                      {businessName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDownload}
                  className="text-white hover:bg-white/10 hover:text-white border border-slate-700/50 hover:border-slate-600"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  className="text-white hover:bg-red-500/20 hover:text-red-400 border border-slate-700/50 hover:border-red-500/50 h-10 w-10"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Media Content */}
        <div className="relative w-full h-full flex items-center justify-center p-8 pt-32 pb-12">
          {/* Gradient Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          {/* Media Container */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {mediaType === "image" ? (
              <div className="relative max-w-full max-h-full flex items-center justify-center group">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-3xl p-4 border border-slate-700/50 shadow-2xl">
                  <Image
                    src={mediaUrl}
                    alt="Report media"
                    width={1920}
                    height={1080}
                    className="max-w-full max-h-[75vh] object-contain rounded-2xl"
                    unoptimized
                  />
                </div>
              </div>
            ) : (
              <div className="relative max-w-full max-h-full flex items-center justify-center group">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-slate-900/50 backdrop-blur-sm rounded-3xl p-4 border border-slate-700/50 shadow-2xl">
                  <video
                    src={mediaUrl}
                    controls
                    autoPlay
                    className="max-w-full max-h-[75vh] rounded-2xl shadow-2xl"
                    style={{ maxWidth: "100%", maxHeight: "75vh" }}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Floating Bottom Bar (Optional Info) */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-6 py-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-slate-300 font-medium">
                  {mediaType === "image" ? "Image" : "Video"} • High Quality
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
