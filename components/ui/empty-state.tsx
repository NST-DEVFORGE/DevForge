interface EmptyStateProps {
    loading?: boolean;
    error?: string | null;
    loadingLabel?: string;
    onRetry?: () => void;
}

export function DataState({ loading, error, loadingLabel = "Loading...", onRetry }: EmptyStateProps) {
    if (loading) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-neutral-400 text-lg">{loadingLabel}</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[40vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-xl mb-4">{error}</p>
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="px-6 py-3 bg-cyan-400 hover:bg-cyan-500 text-black rounded-lg transition-colors"
                        >
                            Retry
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return null;
}
