import React, { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Loader2, Send, X, ImageIcon, Camera } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "@/components/ui/use-toast";
import MobileSelect from "@/components/ui/MobileSelect";
import { moderateContentArray } from "@/lib/contentModeration";

const categories = [
  { value: "education", label: "Education Scam" },
  { value: "employment", label: "Employment Scam" },
  { value: "social_media", label: "Social Media Scam" },
  { value: "marketplace", label: "Marketplace Scam" },
  { value: "financial", label: "Financial Scam" },
  { value: "phishing", label: "Phishing" },
  { value: "relationship", label: "Relationship Scam" },
  { value: "package_delivery", label: "Package & Delivery" },
  { value: "other", label: "Other" },
];

export default function ReportForm({ onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [dateEncountered, setDateEncountered] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationError, setModerationError] = useState("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !category) return;

    const moderation = moderateContentArray([title, description]);
    if (moderation.isViolating) {
      setModerationError(moderation.message);
      return;
    }
    setModerationError("");

    setIsSubmitting(true);

    let screenshotUrl = "";
    if (imageFile) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: imageFile });
      screenshotUrl = file_url;
    }

    await base44.entities.ScamReport.create({
      title,
      description,
      category,
      screenshot_url: screenshotUrl,
      date_encountered: dateEncountered || undefined,
      status: "pending",
      risk_level: "moderate",
    });

    toast({
      title: "Report Submitted",
      description: "Thank you! Your report will be reviewed by our team.",
    });

    setIsSubmitting(false);
    onSuccess?.();
  };

  return (
    <Card className="border-0 shadow-xl shadow-black/5">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Report a Scam</CardTitle>
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Help protect others by sharing scams you've encountered. Personal information is removed automatically.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-xs font-medium">Title</Label>
            <Input
              id="title"
              placeholder='e.g., "Fake scholarship email from unknown sender"'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="desc" className="text-xs font-medium">Description</Label>
            <Textarea
              id="desc"
              placeholder="Describe the scam in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 min-h-[100px] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-medium">Category</Label>
              <MobileSelect
                value={category}
                onChange={setCategory}
                options={categories}
                placeholder="Select category..."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label className="text-xs font-medium">Date Encountered</Label>
              <Input
                type="date"
                value={dateEncountered}
                onChange={(e) => setDateEncountered(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium">Screenshot (optional)</Label>
            {imagePreview ? (
              <div className="mt-1.5 relative rounded-lg overflow-hidden border">
                <img src={imagePreview} alt="" className="w-full max-h-40 object-contain bg-muted" />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 w-6 h-6"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ) : (
              <div className="mt-1.5 w-full border-2 border-dashed rounded-lg p-6 flex flex-col items-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors">
                <ImageIcon className="w-5 h-5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Add screenshot</span>
                <div className="flex gap-2 w-full">
                  <Button type="button" variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => cameraRef.current?.click()}>
                    <Camera className="w-3.5 h-3.5" /> Take Photo
                  </Button>
                  <Button type="button" variant="outline" size="sm" className="flex-1 gap-1.5" onClick={() => fileRef.current?.click()}>
                    <ImageIcon className="w-3.5 h-3.5" /> Library
                  </Button>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </div>

          {moderationError && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {moderationError}
            </div>
          )}
          <Button
            type="submit"
            disabled={!title || !description || !category || isSubmitting}
            className="w-full font-semibold"
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-4 h-4 mr-2" /> Submit Report</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}