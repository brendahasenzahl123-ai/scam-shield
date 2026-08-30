import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, ArrowRight } from "lucide-react";

export default function AuthTimeoutScreen({ onRetry, onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warning/10 mb-4">
          <AlertTriangle className="w-7 h-7 text-warning" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-2">Taking a while to load</h1>
        <p className="text-muted-foreground mb-8">
          We're having trouble connecting to the server. This can happen on slower connections
          or inside in-app browsers.
        </p>
        <div className="flex flex-col gap-3">
          <Button onClick={onRetry} className="w-full h-12 font-medium">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </Button>
          <Button variant="outline" onClick={onContinue} className="w-full h-12 font-medium">
            Continue without an account
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}