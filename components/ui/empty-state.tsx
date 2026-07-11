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
                    <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
                            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
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
