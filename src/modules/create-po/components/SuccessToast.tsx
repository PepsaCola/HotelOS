interface Props {
    visible: boolean;
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
            <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export default function SuccessToast({ visible }: Props) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`fixed bottom-6 right-6 z-50 flex items-start gap-3 rounded-2xl bg-[#1f2028] px-4 py-[14px] text-white shadow-[0_18px_30px_rgba(0,0,0,0.22)] transition-[opacity,transform] duration-200 ease-out ${
                visible
                    ? "pointer-events-auto translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2.5 opacity-0"
            }`}
        >
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10">
                <CheckIcon />
            </div>
            <div>
                <div className="mb-1 text-[13px] font-bold">Purchase order created</div>
                <div className="text-xs text-white/80">Your PO has been created successfully.</div>
            </div>
        </div>
    );
}