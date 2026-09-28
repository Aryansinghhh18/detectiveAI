import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-6 text-left">
          <div className="max-w-lg w-full p-8 rounded-2xl bg-red-950/40 border border-red-500/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚠️</span>
              <div>
                <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider block">
                  INVESTIGATION ERROR CAUGHT
                </span>
                <h2 className="text-xl font-bold text-white">Something went wrong</h2>
              </div>
            </div>
            <p className="text-sm text-slate-300 font-mono mb-4 leading-relaxed bg-black/50 p-3 rounded-lg border border-white/10">
              {this.state.error?.message || "An unexpected error occurred during rendering."}
            </p>
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-colors shadow-lg"
            >
              RELOAD DASHBOARD
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
