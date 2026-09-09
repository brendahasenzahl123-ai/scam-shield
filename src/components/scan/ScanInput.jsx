import React, { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Type, Link2, Loader2, ImageIcon, X, Camera } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function ScanInput({ onAnalyze, isAnalyzing, initialTab, initialText, initialLink }) {
  const [tab, setTab] = useState(initialTab || "text");
  const [text, setText] = useState(initialText || "");
  const [link, setLink] = useState(initialLink || "");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef(null);
  const cameraRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (tab === "text" && text.trim()) {
      onAnalyze({ type: "text", content: text.trim() });
    } else if (tab === "link" && link.trim()) {
      onAnalyze({ type: "link", content: link.trim() });
    } else if (tab === "image" && imageFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
      onAnalyze({ type: "image", content: "", imageUrl: file_url });
    }
  };

  const canSubmit = (tab === "text" && text.trim()) ||
    (tab === "link" && link.trim()) ||
    (tab === "image" && imageFile);

  return (
    <Card className="border shadow-sm">
      <CardContent className="p-5">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-muted/60">
            <TabsTrigger value="text" className="gap-1.5 text-xs sm:text-sm">
              <Type className="w-3.5 h-3.5" />
              Text
            </TabsTrigger>
            <TabsTrigger value="image" className="gap-1.5 text-xs sm:text-sm">
              <ImageIcon className="w-3.5 h-3.5" />
              Image
            </TabsTrigger>
            <TabsTrigger value="link" className="gap-1.5 text-xs sm:text-sm">
              <Link2 className="w-3.5 h-3.5" />
              Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text">
            <Textarea
              placeholder="Paste a suspicious message, email, DM, job offer, or scholarship offer here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[140px] resize-none bg-muted/30 border-muted focus:bg-background transition-colors"
            />
          </TabsContent>

          <TabsContent value="image">
            {imagePreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full max-h-60 object-contain bg-muted/30" />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-7 h-7"
                  onClick={clearImage}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center gap-4 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Upload a screenshot</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, or HEIC</p>
                </div>
                <div className="flex gap-3 w-full">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2 h-11"
                    onClick={() => cameraRef.current?.click()}
                  >
                    <Camera className="w-4 h-4" /> Take Photo
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 gap-2 h-11"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImageIcon className="w-4 h-4" /> Photo Library
                  </Button>
                </div>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              ref={cameraRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
          </TabsContent>

          <TabsContent value="link">
            <Input
              placeholder="https://suspicious-website.com"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="bg-muted/30 border-muted focus:bg-background transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Paste a suspicious URL to check if it's safe
            </p>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit || isAnalyzing}
          className="w-full mt-4 h-11 font-semibold"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze for Scams"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}