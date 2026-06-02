interface MatchingLoaderProps {
    poNumber: string;
}

export function MatchingLoader({ poNumber }: MatchingLoaderProps) {
    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/55">
            <div className="min-w-[280px] rounded-2xl bg-white px-10 py-9 text-center shadow-[0_16px_48px_rgba(0,0,0,.22)]">
                <div className="mx-auto mb-4 h-10 w-10 rounded-full border-[3px] border-hair-2 border-t-accent animate-spin" />
                <div className="text-[15px] font-bold text-ink-900 mb-1.5">
                    Rerunning Matching
                </div>
                <div className="text-[13px] text-muted">
                    Linking {poNumber} and checking line items…
                </div>
            </div>
        </div>
    );
}