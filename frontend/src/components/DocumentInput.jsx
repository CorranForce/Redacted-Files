import React, { useRef } from "react";
import { Upload, FileText, CalendarIcon, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export const DocumentInput = ({
  selectedFile,
  setSelectedFile,
  documentText,
  setDocumentText,
  documentDate,
  setDocumentDate,
}) => {
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) setSelectedFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  return (
    <div className="space-y-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#a1a1aa]">
        // document input
      </p>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="bg-[#18181b] border border-[#3f3f46] rounded-none h-10 p-0">
          <TabsTrigger
            data-testid="upload-tab"
            value="upload"
            className="rounded-none font-mono text-xs uppercase tracking-widest data-[state=active]:bg-[#27272a] data-[state=active]:text-[#22c55e] px-6 h-full"
          >
            <Upload className="w-3.5 h-3.5 mr-2" />
            Upload PDF
          </TabsTrigger>
          <TabsTrigger
            data-testid="paste-tab"
            value="paste"
            className="rounded-none font-mono text-xs uppercase tracking-widest data-[state=active]:bg-[#27272a] data-[state=active]:text-[#22c55e] px-6 h-full"
          >
            <FileText className="w-3.5 h-3.5 mr-2" />
            Paste Text
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <div
            data-testid="file-dropzone"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative border-2 border-dashed border-[#3f3f46] bg-[#0a0a0c] p-12 cursor-pointer hover:border-[#22c55e]/50 transition-colors dropzone-grid overflow-hidden group"
          >
            <div className="dropzone-scanline group-hover:opacity-100 opacity-0 transition-opacity" />
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
              data-testid="file-input"
            />
            {selectedFile ? (
              <div className="flex items-center justify-center gap-4">
                <FileText className="w-8 h-8 text-[#22c55e]" />
                <div>
                  <p className="font-mono text-sm text-[#f4f4f5]">{selectedFile.name}</p>
                  <p className="font-mono text-xs text-[#a1a1aa]">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <Button
                  data-testid="remove-file-btn"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  className="text-[#ef4444] hover:bg-[#ef4444]/10 rounded-none"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <Upload className="w-8 h-8 text-[#3f3f46] mx-auto" />
                <p className="font-mono text-sm text-[#a1a1aa]">
                  Drop your classified file here
                </p>
                <p className="font-mono text-xs text-[#3f3f46]">
                  PDF, TXT, DOC supported
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="paste" className="mt-4">
          <Textarea
            data-testid="text-input"
            value={documentText}
            onChange={(e) => setDocumentText(e.target.value)}
            placeholder="Paste declassified document text here..."
            className="min-h-[200px] bg-black/50 border-[#3f3f46] rounded-none font-mono text-sm text-[#f4f4f5] placeholder:text-[#3f3f46] focus:border-[#22c55e] focus:ring-0 resize-none"
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center gap-4">
        <p className="font-mono text-xs uppercase tracking-widest text-[#a1a1aa]">
          Document Date (optional):
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              data-testid="document-date-picker"
              variant="outline"
              className="rounded-none border-[#3f3f46] bg-transparent font-mono text-xs text-[#a1a1aa] hover:border-[#22c55e] hover:text-[#22c55e] hover:bg-transparent gap-2"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              {documentDate ? format(documentDate, "PPP") : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-[#18181b] border-[#3f3f46] rounded-none" align="start">
            <Calendar
              mode="single"
              selected={documentDate}
              onSelect={setDocumentDate}
              className="text-[#f4f4f5]"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
