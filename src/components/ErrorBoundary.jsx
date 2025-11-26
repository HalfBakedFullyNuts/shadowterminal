import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-6 border border-red-500 bg-red-500/10 text-red-500 font-mono">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-6 h-6" /> SYSTEM FAILURE
                    </h2>
                    <p className="mb-2">CRITICAL ERROR DETECTED IN SUBROUTINE.</p>
                    <details className="whitespace-pre-wrap text-sm opacity-80">
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo && this.state.errorInfo.componentStack}
                    </details>
                </div>
            );
        }

        return this.props.children;
    }
}
