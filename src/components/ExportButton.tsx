"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, Sheet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  filters?: {
    startDate?: string;
    endDate?: string;
  };
}

export function ExportButton({ filters = {} }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"excel" | "pdf" | null>(null);

  const handleExport = async (format: "excel" | "pdf") => {
    try {
      setIsExporting(true);
      setExportType(format);

      const queryParams = new URLSearchParams();
      if (filters.startDate) queryParams.append("startDate", filters.startDate);
      if (filters.endDate) queryParams.append("endDate", filters.endDate);

      const response = await fetch(
        `/api/transactions/export/${format}?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Download file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `transactions-${
        new Date().toISOString().split("T")[0]
      }.${format}`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) filename = filenameMatch[1];
      }

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
      setExportType(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={isExporting}
          variant="outline"
          className="gap-2 bg-primary text-white"
          size="sm"
        >
          <Download className="h-4 w-4" />
          {isExporting
            ? `Exporting ${exportType?.toUpperCase()}...`
            : "Export Data"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <Sheet className="h-4 w-4 text-green-600" />
          <div>
            <div className="font-medium">Export to Excel</div>
            <div className="text-xs text-muted-foreground">
              .xlsx format with summary
            </div>
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => handleExport("pdf")}
          disabled={isExporting}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4 text-red-600" />
          <div>
            <div className="font-medium">Export to PDF</div>
            <div className="text-xs text-muted-foreground">
              .pdf format with styling
            </div>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
