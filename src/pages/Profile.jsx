import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Edit2, Check, X, BookOpen, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import SettingsSection from "@/components/profile/SettingsSection";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
} from "@/components/ui/alert-dialog";


const AVATAR_COLORS = [
  "bg-primary", "bg-blue-500", "bg-purple-500", "bg-rose-500",
  "bg-amber-500", "bg-emerald-500", "bg-cyan-500", "bg-indigo-500",
];

export default function Profile() {
  const { user: authUser, isLoadingAuth } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [profileError, setProfileError] = useState(null);
  const queryClient = useQueryClient();

  const user = authUser;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const profiles = await base44.entities.UserProfile.filter({ user_id: user.id });
        if (cancelled) return;
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          setEditName(profiles[0].display_name || "");
          setEditBio(profiles[0].bio || "");
        } else {
          const created = await base44.entities.UserProfile.create({
            user_id: user.id,
            display_name: "",
            bio: "",
            avatar_color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
            scamshield_score: 0,
            reputation: 0,
            badges: [],
            saved_post_ids: [],
            completed_modules: [],
          });
          if (cancelled) return;
          setProfile(created);
        }
      } catch (err) {
        setProfileError(err.message || "Failed to load profile");
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const { data: scans = [] } = useQuery({
    queryKey: ["user-scans"],
    queryFn: () => base44.entities.ScanResult.list("-created_date", 200),
    enabled: !!user,
    retry: 1,
  });

  const { data: posts = [] } = useQuery({
    queryKey: ["user-posts"],
    queryFn: () => base44.entities.CommunityPost.filter({ visibility: "public" }, "-created_date", 50),
    enabled: !!user,
    retry: 1,
  });

  const { data: journal = [] } = useQuery({
    queryKey: ["journal-entries"],
    queryFn: () => base44.entities.JournalEntry.list("-created_date", 100),
    enabled: !!user,
    retry: 1,
  });

  const completedModules = (() => {
    try { return JSON.parse(localStorage.getItem("completedModules") || "[]"); } catch { return []; }
  })();

  const highRisk = scans.filter(s => s.risk_level === "high" || s.risk_level === "extreme").length;
  const bookmarked = scans.filter(s => s.is_bookmarked).length;

  // ScamShield score: analyses + reports + modules + community
  const score = Math.min(100,
    Math.round((scans.length * 2) + (posts.length * 10) + (completedModules.length * 4) + (bookmarked * 1))
  );

  const badges = [];
  if (scans.length >= 1) badges.push({ id: "first_scan", label: "First Analysis", icon: "🔍" });
  if (scans.length >= 10) badges.push({ id: "ten_scans", label: "Scam Spotter", icon: "🛡️" });
  if (posts.length >= 1) badges.push({ id: "first_report", label: "Community Helper", icon: "🤝" });
  if (completedModules.length >= 5) badges.push({ id: "learner", label: "Scam Researcher", icon: "📚" });
  if (completedModules.length >= 15) badges.push({ id: "educator", label: "Verified Contributor", icon: "✅" });
  if (highRisk >= 5) badges.push({ id: "detective", label: "Scam Detective", icon: "🔎" });
  if (posts.length >= 5) badges.push({ id: "investigator", label: "Top Investigator", icon: "🏆" });

  const saveProfile = async () => {
    if (!profile) return;
    setSaving(true);
    const updated = await base44.entities.UserProfile.update(profile.id, {
      display_name: editName,
      bio: editBio,
      scamshield_score: score,
      badges: badges.map(b => b.id),
    });
    setProfile(updated);
    setEditing(false);
    setSaving(false);
  };

  if (isLoadingAuth) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="max-w-md mx-auto px-4 pt-20 text-center">
      <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <User className="w-7 h-7 text-primary" />
      </div>
      <h1 className="text-xl font-bold mb-2">Sign in to view your profile</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Your profile, badges, and scan history are tied to your account.
      </p>
      <Link to="/login">
        <Button className="w-full h-12 font-medium">Sign In</Button>
      </Link>
      <Link to="/" className="block text-sm text-muted-foreground hover:text-primary hover:underline mt-4">
        Continue as guest
      </Link>
    </div>
  );

  if (profileError && !profile) return (
    <div className="max-w-md mx-auto px-4 pt-20 text-center">
      <div className="w-14 h-14 rounded-md bg-destructive/10 flex items-center justify-center mx-auto mb-4">
        <User className="w-7 h-7 text-destructive" />
      </div>
      <h1 className="text-xl font-bold mb-2">Couldn't load profile</h1>
      <p className="text-sm text-muted-foreground mb-6">{profileError}</p>
      <Button onClick={() => window.location.reload()} className="w-full h-12 font-medium">Try Again</Button>
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const displayName = profile?.display_name || user.full_name || "Community Member";
  const avatarColor = profile?.avatar_color || "bg-primary";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const stats = [
    { label: "Analyses completed", value: scans.length },
    { label: "Reports shared", value: posts.length },
    { label: "Lessons completed", value: completedModules.length },
    { label: "Saved results", value: bookmarked },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 pt-6 pb-12 space-y-5">

      {/* Profile Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-md ${avatarColor} flex items-center justify-center text-white text-xl font-bold shrink-0`}>
              {initial}
            </div>
            <div className="flex-1 min-w-0">
              {editing ? (
                <div className="space-y-2">
                  <Input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    placeholder="Display name"
                    className="h-9"
                  />
                  <Input
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    placeholder="Short bio (optional)"
                    className="h-9"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" onClick={saveProfile} disabled={saving} className="gap-1.5">
                      <Check className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold">{displayName}</h1>
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => setEditing(true)}>
                      <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">{user.email}</p>
                  {profile?.bio && <p className="text-sm mt-1.5">{profile.bio}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    Joined {user.created_date ? format(new Date(user.created_date), "MMM yyyy") : "Recently"}
                  </p>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats list */}
      <div className="border rounded-md divide-y">
        {stats.map(stat => (
          <div key={stat.label} className="flex items-center justify-between p-3">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-sm font-semibold">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Learning Progress */}
      <Card className="border shadow-sm">
        <CardContent className="p-4">
          <h2 className="text-sm font-semibold mb-3 px-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Learning Progress
          </h2>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(100, (completedModules.length / 6) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold">{completedModules.length}/6</span>
          </div>
          <p className="text-xs text-muted-foreground px-1">
            {completedModules.length === 0
              ? "Start with a topic in the Learn section."
              : completedModules.length < 6
              ? "Good start — keep going through the topics."
              : "You've completed every topic — great work!"}
          </p>
        </CardContent>
      </Card>

      {/* Settings */}
      <SettingsSection userId={user.id} />

      {/* Delete Account */}
      <div className="pt-1">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="w-full gap-2 text-destructive border-destructive/30 hover:bg-destructive/5">
              <Trash2 className="w-4 h-4" /> Delete Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your account?</AlertDialogTitle>
              <AlertDialogDescription>
                This action is permanent. Your profile, scan history, journal entries, and community posts will be deleted and cannot be recovered. To complete account deletion, please contact support.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                onClick={() => base44.auth.logout("/")}
              >
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

    </div>
  );
}