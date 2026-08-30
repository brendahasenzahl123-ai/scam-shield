import React from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-md mx-auto px-4 pt-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm text-muted-foreground mb-6">
            This page encountered an error. Try again or go back to the home page.
          </p>
          <div className="flex flex-col gap-2">
            <Button className="w-full h-12 gap-2" onClick={() => this.setState({ hasError: false })}>
              <RefreshCw className="w-4 h-4" /> Try Again
            </Button>
            <Button variant="outline" className="w-full h-12 gap-2" onClick={() => { window.location.href = "/"; }}>
              <Home className="w-4 h-4" /> Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}