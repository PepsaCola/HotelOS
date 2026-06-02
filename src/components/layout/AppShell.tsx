import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { breadcrumbForPath } from "@/lib/nav";
import { useLayout } from "@/contexts/LayoutContext.tsx";
import { DisplayOptionsPopup } from "@/components/ui/DisplayOptionsPopup";

export default function AppShell() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const location = useLocation();

    const { fullBleed, openDisplayOptions, breadcrumb, displayOptions } = useLayout();

    useEffect(() => {
        setMobileNavOpen(false);
    }, [location.pathname]);

    const crumbs = breadcrumb ?? breadcrumbForPath(location.pathname);

    const isPoLog = location.pathname.startsWith("/po-log");

    const isFullBleed =
        fullBleed ||
        location.pathname.startsWith("/settings") ||
        location.pathname.startsWith("/create-po");

    return (
        <div className="flex min-h-screen bg-[#F6F6F4]">
            <Sidebar
                open={mobileNavOpen}
                onClose={() => setMobileNavOpen(false)}
                onOpenDisplayOptions={openDisplayOptions}
            />

            <div className="flex min-w-0 flex-1 flex-col">
                <Topbar crumbs={crumbs} onOpenMenu={() => setMobileNavOpen(true)} />
                <main
                    data-density={displayOptions.density}
                    data-fin-emphasis={displayOptions.financialEmphasis ? "on" : "off"}
                    className={`min-w-0 flex-1 ${isFullBleed ? "" : "px-4 py-4 lg:px-7 lg:pb-20"}`}
                >
                    <Outlet />
                </main>
            </div>

            {/* PO Log renders its own richer "Tweaks" popup; everything else uses the shared one. */}
            {!isPoLog && <DisplayOptionsPopup />}
        </div>
    );
}
