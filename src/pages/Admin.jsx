import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  ShieldCheck, ShieldX, Clock, CheckCircle2, XCircle,
  Star, Trash2, Eye, Users, FileText, TrendingUp, Flag
} from "lucide-react";
import RiskBadge from "@/components/scan/RiskBadge";
import ContentReportCard from "@/components/admin/ContentReportCard";
import { format } from "date-fns";

const categoryLabels = {
  education: "Education",
  employment: "Employment",
  social_media: "Social Media",
  marketplace: "Marketplace",
  financial: "Financial",
  phishing: "Phishing",
  relationship: "Relationship",
  package_delivery: "Delivery",
  other: "Other",
};

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: pendingReports = [] } = useQuery({
    queryKey: ["admin-pending"],
    queryFn: () => base44.entities.ScamReport.filter({ status: "pending" }, "-created_date", 100),
    initialData: [],
  });

  const { data: approvedReports = [] } = useQuery({
    queryKey: ["admin-approved"],
    queryFn: () => base44.entities.ScamReport.filter({ status: "approved" }, "-created_date", 100),
    initialData: [],
  });

  const { data: allScans = [] } = useQuery({
    queryKey: ["admin-scans"],
    queryFn: () => base44.entities.ScanResult.list("-created_date", 50),
    initialData: [],
  });

  const { data: contentReports = [] } = useQuery({
    queryKey: ["admin-content-reports"],
    queryFn: () => base44.entities.ContentReport.filter({ status: "pending" }, "created_date", 100),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.ScamReport.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin-approved"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ScamReport.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pending"] });
      queryClient.invalidateQueries({ queryKey: ["admin-approved"] });
    },
  });

  const removeContentMutation = useMutation({
    mutationFn: async ({ report }) => {
      if (report.content_type === "community_post") {
        await base44.entities.CommunityPost.delete(report.content_id);
      } else if (report.content_type === "comment") {
        await base44.entities.PostComment.delete(report.content_id);
      }
      await base44.entities.ContentReport.update(report.id, { status: "removed" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-reports"] });
      queryClient.invalidateQueries({ queryKey: ["community-posts"] });
      toast({ title: "Content removed", description: "The reported content has been deleted." });
    },
  });

  const dismissReportMutation = useMutation({
    mutationFn: (report) => base44.entities.ContentReport.update(report.id, { status: "dismissed" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-reports"] });
      toast({ title: "Report dismissed" });
    },
  });

  const suspendUserMutation = useMutation({
    mutationFn: ({ userId, reason }) => base44.entities.User.update(userId, { suspended: true, suspension_reason: reason || "Community Standards violation" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-content-reports"] });
      toast({ title: "User suspended", description: "This user can no longer publish content." });
    },
  });

  const handleApprove = (report) => {
    updateMutation.mutate({ id: report.id, data: { status: "approved" } });
    toast({ title: "Report approved" });
  };

  const handleReject = (report) => {
    updateMutation.mutate({ id: report.id, data: { status: "rejected" } });
    toast({ title: "Report rejected" });
  };

  const handleFeature = (report) => {
    const newStatus = report.is_trending ? false : true;
    updateMutation.mutate({ id: report.id, data: { is_trending: newStatus, status: "approved" } });
    toast({ title: newStatus ? "Marked as trending" : "Removed from trending" });
  };

  const handleDelete = (report) => {
    deleteMutation.mutate(report.id);
    toast({ title: "Report deleted" });
  };

  const handleRemoveContent = (report) => {
    removeContentMutation.mutate({ report });
  };
  const handleDismissReport = (report) => {
    dismissReportMutation.mutate(report);
  };
  const handleSuspendUser = (report) => {
    suspendUserMutation.mutate({ userId: report.reported_user_id, reason: report.reason });
  };
  const handleBanUser = (report) => {
    suspendUserMutation.mutate({ userId: report.reported_user_id, reason: `Permanent ban: ${report.reason}` });
  };

  const ReportRow = ({ report, showActions = true }) => (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {report.screenshot_url && (
            <img
              src={report.screenshot_url}
              alt=""
              className="w-16 h-16 rounded-lg object-cover bg-muted shrink-0"
            />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm font-semibold">{report.title}</h3>
              {report.is_trending && (
                <Badge className="bg-orange-100 text-orange-700 text-[10px] shrink-0">Trending</Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{report.description}</p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="text-[10px]">
                {categoryLabels[report.category] || report.category}
              </Badge>
              {report.risk_level && <RiskBadge level={report.risk_level} />}
              {report.created_date && (
                <span className="text-[10px] text-muted-foreground">
                  {format(new Date(report.created_date), "MMM d, yyyy")}
                </span>
              )}
            </div>
          </div>
        </div>
        {showActions && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => handleApprove(report)}>
              <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Approve
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => handleReject(report)}>
              <XCircle className="w-3 h-3 text-red-500" /> Reject
            </Button>
            <Button size="sm" variant="outline" className="gap-1 text-xs h-7" onClick={() => handleFeature(report)}>
              <Star className="w-3 h-3 text-amber-500" /> Feature
            </Button>
            <Button size="sm" variant="ghost" className="gap-1 text-xs h-7 text-destructive ml-auto" onClick={() => handleDelete(report)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 pt-6">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          Admin Panel
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage scam reports and moderate community submissions
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <Clock className="w-5 h-5 mx-auto mb-1 text-amber-500" />
            <p className="text-lg font-bold">{pendingReports.length}</p>
            <p className="text-[10px] text-muted-foreground">Pending</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <FileText className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
            <p className="text-lg font-bold">{approvedReports.length}</p>
            <p className="text-[10px] text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-bold">{allScans.length}</p>
            <p className="text-[10px] text-muted-foreground">Total Scans</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 text-center">
            <Flag className="w-5 h-5 mx-auto mb-1 text-red-500" />
            <p className="text-lg font-bold">{contentReports.length}</p>
            <p className="text-[10px] text-muted-foreground">Reports</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="mb-4">
          <TabsTrigger value="pending" className="gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Pending ({pendingReports.length})
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5">
            <Flag className="w-3.5 h-3.5" />
            Reports ({contentReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingReports.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No pending reports</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((report) => (
                <ReportRow key={report.id} report={report} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved">
          {approvedReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No approved reports yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {approvedReports.map((report) => (
                <ReportRow key={report.id} report={report} showActions />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reports">
          {contentReports.length === 0 ? (
            <div className="text-center py-12">
              <ShieldCheck className="w-10 h-10 mx-auto mb-3 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No pending content reports</p>
              <p className="text-xs text-muted-foreground mt-1">User-reported content will appear here for review</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contentReports.map((report) => (
                <ContentReportCard
                  key={report.id}
                  report={report}
                  onRemove={handleRemoveContent}
                  onDismiss={handleDismissReport}
                  onSuspend={handleSuspendUser}
                  onBan={handleBanUser}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}