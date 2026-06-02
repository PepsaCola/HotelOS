import type { LineItem, DepartmentAllocation } from "@/types/createPO";
import { formatCurrency, formatDocumentDate, normalizeDeptValue, parseCurrency } from "../lib/po";

// Оновлений текст приміток відповідно до фото
const NOTES_TEXT =
    "Above Order Number must appear on all correspondence, invoices, packages and shipping papers. Notify us immediately if you are unable to ship complete order by date specified. Your acceptance of this order is your warranty to us that you are complying with the U.S. Fair Labor Standards Act of 1938, as amended, and we reserve the right to refuse merchandise not in strict accordance with this order.";

const HOTEL_LOGO_URL =
    "https://www.figma.com/api/mcp/asset/01865987-46d6-4baf-87e6-87e6b52e6053";

interface Props {
    poNumber: string;
    date: string;
    budgetClassification: string;
    accountNumber: string;
    billedTo: string;
    vendor: string;
    shipping: string;
    tax: string;
    lineItems: LineItem[];
    departments: DepartmentAllocation[];
}

export default function PODocument({
                                       poNumber, date, budgetClassification, accountNumber,
                                       billedTo, vendor, shipping, tax, lineItems, departments,
                                   }: Props) {
    const visible = lineItems.filter(
        (i) => i.qty || i.unit || i.description || i.unitPrice || i.amount,
    );
    const subtotal = visible.reduce((s, i) => s + parseCurrency(i.amount), 0);
    const shippingVal = parseCurrency(shipping);
    const taxVal = parseCurrency(tax);
    const total = subtotal + shippingVal + taxVal;

    return (
        <div
            className="flex flex-col justify-between bg-white border border-[#e2e3e6] shadow-[0_8px_15px_rgba(0,0,0,0.15)] p-5 sm:p-10 md:p-[64px] min-h-[auto] md:min-h-[1467px]"
            style={{ fontFamily: "Instrument Sans, Inter, system-ui, sans-serif" }}
        >
            <div>
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-5 sm:gap-0 pb-6">
                    <div className="flex items-center md:h-[66px] md:w-[421px]">
                        <img
                            src={HOTEL_LOGO_URL}
                            alt="HotelOS"
                            className="w-[200px] sm:w-[260px] md:w-[319px] h-auto object-contain"
                        />
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                        <div className="text-[#524c41] text-[16px] sm:text-[18px] mb-1 sm:mb-0">
                            {poNumber}
                        </div>
                        <div
                            className="text-[24px] sm:text-[32px] font-bold leading-tight"
                            style={{ fontFamily: '"Anonymous Pro", "JetBrains Mono", monospace' }}
                        >
                            Purchase Order
                        </div>
                    </div>
                </div>

                {/* ── Double rule ── */}
                <div className="flex flex-col gap-[1px] mb-0">
                    <div className="h-[1px] bg-[#29253b]" />
                    <div className="h-[1px] bg-[#29253b]" />
                </div>

                {/* ── Meta: Billed To / Vendor / Date-Classification-Account ── */}
                <div className="flex flex-col md:flex-row justify-between">
                    {[
                        {
                            heading: "Billed To",
                            title: billedTo,
                            lines: [
                                "Department Operations Purchase Desk",
                                "DoubleTree by Hilton Hotel Orlando Airport",
                                "5555 Hazeltine National Drive",
                                "Orlando, FL 32812",
                            ],
                            isFirst: true,
                        },
                        {
                            heading: "Vendor",
                            title: vendor,
                            lines: [
                                "Approved Supplier Record",
                                "Service Delivery as Quoted",
                                `Reference all shipments to ${poNumber}`,
                            ],
                            isFirst: false,
                        },
                    ].map(({ heading, title, lines, isFirst }) => (
                        <div
                            key={heading}
                            className={`flex-1 py-5 md:py-[24px] ${
                                isFirst
                                    ? "md:pr-[28px]"
                                    : "border-t border-[#e1dcd0] md:border-t-0 md:border-l md:pl-[28px] md:pr-[28px]"
                            }`}
                        >
                            <div className="text-[#8b8575] text-[10px] tracking-[1.2px] uppercase mb-2 sm:mb-3">
                                {heading}
                            </div>
                            <div className="text-[15px] sm:text-[16px] font-semibold mb-1.5 sm:mb-2 text-ink-900">
                                {title}
                            </div>
                            <div className="grid gap-1.5 sm:gap-2 text-[#524c41] text-[13px] sm:text-[14px]">
                                {lines.map((line) => <span key={line}>{line}</span>)}
                            </div>
                        </div>
                    ))}

                    {/* Date / Classification / Account */}
                    <div className="flex-1 py-5 md:py-[24px] border-t border-[#e1dcd0] md:border-t-0 md:border-l md:pl-[28px]">
                        <div className="grid gap-2.5 sm:gap-2 text-[#524c41] text-[13px] sm:text-[14px]">
                            {[
                                { label: "Date", value: formatDocumentDate(date) },
                                { label: "Classification", value: budgetClassification },
                                { label: "Account", value: accountNumber },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-start gap-4 sm:gap-2">
                                    <span>{label}</span>
                                    <span className="text-right font-medium text-[#29253b]">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Line items table (Зі скролом на мобільних) ── */}
                <div className="border-t border-[#e1dcd0] mt-2 sm:mt-0">
                    <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                        <table className="w-full min-w-[640px] border-collapse text-[13px] sm:text-[14px]">
                            <thead>
                            <tr>
                                {[
                                    { label: "Qty", w: "80px", right: false },
                                    { label: "Package/Unit", w: "140px", right: false },
                                    { label: "Description", w: "auto", right: false },
                                    { label: "Unit Price", w: "120px", right: true },
                                    { label: "Amount", w: "120px", right: true },
                                ].map(({ label, w, right }) => (
                                    <th
                                        key={label}
                                        className="pt-4 pb-2 sm:pt-[20px] sm:pb-[8px] border-b border-[#29253b] text-[10px] sm:text-[11px] tracking-[1.32px] uppercase text-ink-900"
                                        style={{ width: w, textAlign: right ? "right" : "left" }}
                                    >
                                        {label}
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {visible.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-3.5 sm:py-[20px] border-b border-dashed border-[#d9d3c3] align-top">{item.qty || "—"}</td>
                                    <td className="py-3.5 sm:py-[20px] border-b border-dashed border-[#d9d3c3] align-top">{item.unit || "—"}</td>
                                    <td className="py-3.5 sm:py-[20px] pr-[18px] border-b border-dashed border-[#d9d3c3] align-top font-medium text-ink-900">
                                        {item.description || "—"}
                                    </td>
                                    <td className="py-3.5 sm:py-[20px] border-b border-dashed border-[#d9d3c3] align-top text-right text-[#524c41]">
                                        {item.unitPrice || "—"}
                                    </td>
                                    <td className="py-3.5 sm:py-[20px] border-b border-dashed border-[#d9d3c3] align-top text-right text-[#524c41]">
                                        {item.amount || "—"}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Lower grid: departments + totals ── */}
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-[28px] mt-8 lg:mt-[36px] items-start lg:items-end">

                    {/* Departments */}
                    <div className="flex-1 w-full overflow-hidden">
                        <div className="text-[#8b8575] text-[10px] tracking-[1.2px] uppercase mb-2.5 sm:mb-3">
                            Department Distribution
                        </div>
                        {departments.map((dept) => (
                            <div
                                key={dept.id}
                                className="flex flex-col sm:grid sm:grid-cols-[120px_1fr_120px] gap-1.5 sm:gap-4 py-2.5 sm:py-[10px] border-b border-dashed border-[#d9d3c3] text-[13px] sm:text-[14px] text-[#524c41]"
                            >
                                <span className="font-medium sm:font-normal text-ink-900 sm:text-[#524c41]">{dept.label}</span>
                                <span className="flex justify-between sm:block">
                                    <span className="sm:hidden text-muted text-[12px]">Account:</span>
                                    {normalizeDeptValue(dept.account, "Account")}
                                </span>
                                <span className="flex justify-between sm:block">
                                    <span className="sm:hidden text-muted text-[12px]">Amount:</span>
                                    {normalizeDeptValue(dept.amount, "Amount")}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="w-full lg:w-[280px] grid gap-2.5 sm:gap-2.5">
                        {[
                            { label: "Subtotal", value: formatCurrency(subtotal) },
                            { label: "Shipping", value: formatCurrency(shippingVal) },
                            { label: "Tax", value: formatCurrency(taxVal) },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex justify-between gap-4 text-[13px] sm:text-[14px] text-[#524c41]">
                                <span>{label}</span>
                                <strong className="text-ink-900">{value}</strong>
                            </div>
                        ))}
                        <div className="flex justify-between gap-4 pt-3 border-t border-[#55586d] text-[16px] sm:text-[18px] text-[#524c41]">
                            <span>Total</span>
                            <strong className="text-ink-900">{formatCurrency(total)}</strong>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex flex-col md:flex-row mt-10 md:mt-[48px] pt-5 md:pt-[24px]">

                {/* Ліва частина: Підписи */}
                <div className="w-full md:w-1/2 flex flex-col pr-0 md:pr-[40px] mb-8 md:mb-0">
                    <div className="text-ink-900 font-medium text-[14px] sm:text-[15px] mb-6 md:mb-[32px]">
                        GM and Controller Approval Required for Agreement
                    </div>

                    <div className="flex flex-col gap-6 md:gap-[32px]">
                        {["Dept. Head", "Controller", "General Manager"].map((label) => (
                            <div key={label} className="flex items-end justify-between">
                                <div className="text-[#524c41] text-[13px] sm:text-[14px] w-[40%]">
                                    {label}
                                </div>
                                <div className="w-[60%] text-center border-b border-dashed border-[#8b8575] text-[#8b8575] text-[12px] sm:text-[13px] pb-1">
                                    Signature Here
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Права частина: Нотатки */}
                <div className="w-full md:w-1/2 md:border-l border-t md:border-t-0 border-[#e1dcd0] pt-6 md:pt-0 md:pl-[40px]">
                    <div className="text-[#8b8575] text-[10px] tracking-[1.2px] uppercase mb-3">
                        NOTES
                    </div>
                    <p className="text-[#524c41] text-[12px] md:text-[13px] leading-relaxed">
                        {NOTES_TEXT}
                    </p>
                </div>

            </div>
        </div>
    );
}