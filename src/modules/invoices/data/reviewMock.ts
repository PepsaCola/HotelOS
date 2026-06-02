import type { PoDetail, ReviewData, ReviewFlow } from "@/types/invoices";

// ── Shared defaults ───────────────────────────────────────────────────────────

const BILLED_TO = "DoubleTree Orlando Airport";

const DEFAULT_PO_DETAIL: Omit<PoDetail, "ref" | "desc" | "account" | "amount" | "date" | "percent" | "tone"> = {
    poNumber: "EN0513", poDate: "19.05.2026", budgetClass: "Expense", accountNumber: "106250000",
    vendorShort: "Clean Tec Services", billedTo: BILLED_TO, lineMatch: "LN 9/9",
    mismatches: {},
    lineItems: [
        { qty: "1", unit: "Lot", desc: "Planned service package",               unitPrice: "$2,587.10", amount: "$2,587.10", mismatch: false },
        { qty: "1", unit: "Lot", desc: "Additional approved scope — PO line 2", unitPrice: "$2,587.10", amount: "$2,587.10", mismatch: false },
    ],
    subtotal: "$5,174.20", shipping: "$0.00", tax: "$0.00", total: "$5,174.20",
    departments: [{ name: "Rooms", account: "106250000", amount: "$5,174.20" }],
};

const DEFAULT_OTHER_BASES = [
    { ref: "RM0509", desc: "Yearly Carpet Refresh",                               account: "186256868", amount: "$2,547.45",  date: "Apr 02" },
    { ref: "RM0510", desc: "Main Office",                                         account: "186730000", amount: "$2,547.45",  date: "Apr 04" },
    { ref: "RM0511", desc: "Travel Agent Commission for Groups",                  account: "186890000", amount: "$5,128.55",  date: "Apr 04" },
    { ref: "RM0512", desc: "Travel Agent Commission for Individual Bookings",     account: "186895000", amount: "$23,684.00", date: "Apr 08" },
    { ref: "RM0513", desc: "Travel Agent Commission for Airline Bookings",        account: "186895000", amount: "$36,637.00", date: "Apr 12" },
    { ref: "FB0303", desc: "Equipment Rental Fee (Contract #1000676117)",         account: "286355000", amount: "$234.13",    date: "Apr 12" },
    { ref: "PO-25-0341", desc: "Carpet shampoo program",                          account: "186256868", amount: "$2,547.45",  date: "Apr 02" },
    { ref: "PO-25-0355", desc: "Guest room amenities restock — Q1",               account: "186256868", amount: "$1,892.00",  date: "Apr 14" },
    { ref: "PO-25-0362", desc: "Linen replacement — standard rooms",              account: "186730000", amount: "$4,210.80",  date: "Apr 16" },
    { ref: "PO-25-0370", desc: "Pest control — quarterly service",                account: "186890000", amount: "$627.04",    date: "Apr 18" },
    { ref: "PO-25-0378", desc: "HVAC filter replacement — all floors",            account: "206890000", amount: "$3,450.00",  date: "Apr 20" },
    { ref: "PO-25-0385", desc: "Laundry services — F&B linen",                   account: "206355000", amount: "$1,744.60",  date: "Apr 22" },
    { ref: "PO-25-0391", desc: "Elevator annual maintenance — Otis",              account: "106890000", amount: "$5,500.00",  date: "Apr 24" },
    { ref: "PO-25-0399", desc: "IT software licenses renewal",                   account: "406510000", amount: "$8,900.00",  date: "Apr 26" },
    { ref: "PO-25-0404", desc: "Lobby floral arrangement — monthly",              account: "186256868", amount: "$480.00",    date: "Apr 28" },
];

// ── Hydration helpers ─────────────────────────────────────────────────────────

type PoBase = { ref: string; desc: string; account: string; amount: string; date: string; percent?: string; tone?: "perfect" | "high" | "mid" };
type PoFormData = Omit<PoDetail, "ref" | "desc" | "account" | "amount" | "date" | "percent" | "tone">;

function hydrate(base: PoBase, formData: PoFormData): PoDetail {
    return {
        ref:     base.ref,
        desc:    base.desc,
        account: base.account,
        amount:  base.amount,
        date:    base.date,
        percent: base.percent ?? "",
        tone:    base.tone    ?? "",
        ...formData,
    };
}

// ── Per-invoice scenarios ─────────────────────────────────────────────────────

interface Scenario {
    flow: ReviewFlow;
    statusPill: { label: string; cls: string };
    closestMatchBases: PoBase[];
    poDetails: Record<string, PoFormData>;
}

const SCENARIOS: Record<string, Scenario> = {
    // Flow 1 — perfect match (Cleantec water remediation)
    "INV-19763": {
        flow: 1,
        statusPill: { label: "Needs Review", cls: "needs-review" },
        closestMatchBases: [
            { ref: "PO-25-0331", percent: "100% match", tone: "perfect", desc: "Water remediation — Floor 2 & 3", account: "106250000", amount: "$5,174.20", date: "Apr 02" },
            { ref: "PO-25-0287", percent: "85% match",  tone: "high",    desc: "Routine cleaning supplies",        account: "106250000", amount: "$5,174.20", date: "Apr 04" },
            { ref: "PO-25-0341", percent: "81% match",  tone: "mid",     desc: "Carpet shampoo program",           account: "106250000", amount: "$5,174.20", date: "Apr 12" },
        ],
        poDetails: {
            "PO-25-0331": {
                poNumber: "EN0513", poDate: "19.05.2026", budgetClass: "Expense", accountNumber: "106250000",
                vendorShort: "Clean Tec Services", billedTo: BILLED_TO, lineMatch: "LN 9/9",
                mismatches: {},
                lineItems: [
                    { qty: "2,582", unit: "Sq.Ft.", desc: "Water Extraction 3,399 sq.ft. at $0.35/sq.ft.",       unitPrice: "$0.35",   amount: "$903.70",   mismatch: false },
                    { qty: "2,582", unit: "Sq.Ft.", desc: "Apply Anti-microbial Agent 3,399 sq.ft. at $0.25/sq.ft.", unitPrice: "$0.25", amount: "$645.50",   mismatch: false },
                    { qty: "19",    unit: "Each",   desc: "Air movers @ $25.00 each unit/day for 2 days",         unitPrice: "$25.00",  amount: "$950.00",   mismatch: false },
                    { qty: "5",     unit: "Each",   desc: "5 Dehumidifiers @ $80.00 each/day for 2 days",         unitPrice: "$80.00",  amount: "$800.00",   mismatch: false },
                    { qty: "2",     unit: "Day",    desc: "Equipment monitoring & re-locating @ $350 per day",    unitPrice: "$350.00", amount: "$700.00",   mismatch: false },
                    { qty: "6",     unit: "Each",   desc: "Carpet Steam Cleaning",                                 unitPrice: "$25.00",  amount: "$150.00",   mismatch: false },
                    { qty: "2,100", unit: "Sq.Ft.", desc: "Apply Anti-Microbial to kill any virus or bacteria",   unitPrice: "$0.25",   amount: "$525.00",   mismatch: false },
                    { qty: "8",     unit: "Each",   desc: "Equipment set up and take down @ $50.00 per unit",     unitPrice: "$50.00",  amount: "$400.00",   mismatch: false },
                    { qty: "2",     unit: "Each",   desc: "Equipment delivery and pick up @ $50.00 each way",     unitPrice: "$50.00",  amount: "$100.00",   mismatch: false },
                ],
                subtotal: "$5,174.20", shipping: "$0.00", tax: "$0.00", total: "$5,174.20",
                departments: [{ name: "Rooms", account: "106250000", amount: "$5,174.20" }],
            },
        },
    },

    // Flow 2 — over-budget (Aramark)
    "INV-EM-4421": {
        flow: 2,
        statusPill: { label: "Over Budget", cls: "over-budget" },
        closestMatchBases: [
            { ref: "PO-25-0287", percent: "72% match", tone: "mid", desc: "Aramark uniform supply — monthly",  account: "186259000", amount: "$4,800.00", date: "Mar 19" },
            { ref: "PO-25-0341", percent: "61% match", tone: "mid", desc: "Aramark laundry services Q1",       account: "186259000", amount: "$5,100.00", date: "Mar 15" },
        ],
        poDetails: {
            "PO-25-0287": {
                poNumber: "EN0478", poDate: "12.03.2026", budgetClass: "Expense", accountNumber: "186259000",
                vendorShort: "Aramark Laundry LLC", billedTo: BILLED_TO, lineMatch: "LN 4/7",
                mismatches: {
                    vendor:    { field: "Vendor",       invoiceVal: "Aramark Uniform Services", poVal: "Aramark Laundry LLC", reason: "Vendor name mismatch — different entity" },
                    amount:    { field: "Total amount", invoiceVal: "$5,661.00",                poVal: "$4,800.00",           reason: "Invoice exceeds PO amount by $861.00" },
                    overBudget:{ field: "Budget",       invoiceVal: "$5,661.00",                poVal: "Budget: $5,000.00",   reason: "Invoice is $661 over department budget" },
                },
                lineItems: [
                    { qty: "1",  unit: "Month", desc: "Uniform supply — standard package",    unitPrice: "$2,400.00", amount: "$2,400.00", mismatch: false },
                    { qty: "1",  unit: "Month", desc: "Laundry processing fee",               unitPrice: "$1,200.00", amount: "$1,200.00", mismatch: false },
                    { qty: "1",  unit: "Month", desc: "Premium linen service",                unitPrice: "$1,200.00", amount: "$1,200.00", mismatch: false },
                    { qty: "—",  unit: "—",     desc: "Rush delivery surcharge (not on PO)",  unitPrice: "$461.00",   amount: "$461.00",   mismatch: true  },
                    { qty: "—",  unit: "—",     desc: "Late fee (not on PO)",                 unitPrice: "$200.00",   amount: "$200.00",   mismatch: true  },
                    { qty: "—",  unit: "—",     desc: "Sales tax 6.5% (not on PO)",           unitPrice: "—",         amount: "$200.00",   mismatch: true  },
                    { qty: "—",  unit: "—",     desc: "Missing: special handling fee",        unitPrice: "—",         amount: "—",         mismatch: true  },
                ],
                subtotal: "$4,800.00", shipping: "$200.00", tax: "$200.00", total: "$5,661.00",
                departments: [{ name: "A&G", account: "186259000", amount: "$5,661.00" }],
            },
            "PO-25-0341": {
                poNumber: "EN0551", poDate: "10.03.2026", budgetClass: "Expense", accountNumber: "186259000",
                vendorShort: "Aramark Floor Care", billedTo: BILLED_TO, lineMatch: "LN 3/7",
                mismatches: {
                    vendor: { field: "Vendor", invoiceVal: "Aramark Uniform Services", poVal: "Aramark Floor Care", reason: "Different Aramark subsidiary" },
                    amount: { field: "Total",  invoiceVal: "$5,661.00",                poVal: "$5,100.00",          reason: "Invoice $561 over PO amount" },
                },
                lineItems: [
                    { qty: "1", unit: "Month", desc: "Floor care service monthly",  unitPrice: "$2,550.00", amount: "$2,550.00", mismatch: false },
                    { qty: "1", unit: "Month", desc: "Deep clean quarterly",        unitPrice: "$2,550.00", amount: "$2,550.00", mismatch: false },
                    { qty: "—", unit: "—",     desc: "Uniform supply (not on PO)",  unitPrice: "$1,200.00", amount: "$1,200.00", mismatch: true  },
                    { qty: "—", unit: "—",     desc: "Surcharge (not on PO)",       unitPrice: "$361.00",   amount: "$361.00",   mismatch: true  },
                ],
                subtotal: "$5,100.00", shipping: "$0.00", tax: "$561.00", total: "$5,661.00",
                departments: [{ name: "A&G", account: "186259000", amount: "$5,661.00" }],
            },
        },
    },

    // Flow 5 — no match (HD Supply)
    "INV-77321": {
        flow: 5,
        statusPill: { label: "No PO Match", cls: "no-match" },
        closestMatchBases: [],
        poDetails: {},
    },

    // Flow 3 — mismatch (Cintas)
    "INV-COR-8821": {
        flow: 3,
        statusPill: { label: "Needs Review", cls: "needs-review" },
        closestMatchBases: [
            { ref: "PO-25-0390", percent: "88% match", tone: "high", desc: "Cintas cleaning supplies — F&B",  account: "206355000", amount: "$4,450.00", date: "Mar 17" },
            { ref: "PO-25-0312", percent: "74% match", tone: "mid",  desc: "Cintas linen contract Q1",        account: "206355000", amount: "$4,711.74", date: "Mar 10" },
        ],
        poDetails: {
            "PO-25-0390": {
                poNumber: "FB0441", poDate: "15.03.2026", budgetClass: "Expense", accountNumber: "206355000",
                vendorShort: "Cintas Corporation", billedTo: BILLED_TO, lineMatch: "LN 5/7",
                mismatches: {
                    qty:   { field: "Quantity — Line 3",   invoiceVal: "6 cases",      poVal: "4 cases",     reason: "Quantity overbill: 2 extra cases not on PO" },
                    price: { field: "Unit price — Line 4", invoiceVal: "$312.50/ea",   poVal: "$275.00/ea",  reason: "Unit price $37.50 above agreed contract rate" },
                    extra: { field: "Line 6",              invoiceVal: "Hazmat $88.00",poVal: "—",           reason: "Not pre-approved line" },
                },
                lineItems: [
                    { qty: "12", unit: "Case", desc: "Multi-surface cleaner 4L",         unitPrice: "$48.50",  amount: "$582.00",   mismatch: false },
                    { qty: "8",  unit: "Case", desc: "Sanitizer wipes industrial",        unitPrice: "$62.00",  amount: "$496.00",   mismatch: false },
                    { qty: "6",  unit: "Case", desc: "Floor degreaser concentrate",       unitPrice: "$95.00",  amount: "$570.00",   mismatch: true  },
                    { qty: "4",  unit: "Each", desc: "Mop head replacement set",          unitPrice: "$312.50", amount: "$1,250.00", mismatch: true  },
                    { qty: "10", unit: "Box",  desc: "Disposable gloves L",               unitPrice: "$18.50",  amount: "$185.00",   mismatch: false },
                    { qty: "1",  unit: "Fee",  desc: "Disposal / hazmat surcharge",       unitPrice: "$88.00",  amount: "$88.00",    mismatch: true  },
                    { qty: "—",  unit: "—",    desc: "Missing: paper towel bulk (on PO)", unitPrice: "$279.74", amount: "—",         mismatch: true  },
                ],
                subtotal: "$4,450.00", shipping: "$0.00", tax: "$261.74", total: "$4,711.74",
                departments: [{ name: "F&B", account: "206355000", amount: "$4,711.74" }],
            },
            "PO-25-0312": {
                poNumber: "FB0412", poDate: "08.03.2026", budgetClass: "Expense", accountNumber: "206355000",
                vendorShort: "Cintas Corporation", billedTo: BILLED_TO, lineMatch: "LN 6/7",
                mismatches: {
                    price: { field: "Unit price — Line 2", invoiceVal: "$62.00",          poVal: "$55.00", reason: "Price variance $7.00/case above contract" },
                    extra: { field: "Line 6",              invoiceVal: "Disposal $88.00", poVal: "—",      reason: "Not pre-approved line" },
                },
                lineItems: [
                    { qty: "12", unit: "Case", desc: "Multi-surface cleaner 4L",   unitPrice: "$48.50",  amount: "$582.00",   mismatch: false },
                    { qty: "8",  unit: "Case", desc: "Sanitizer wipes industrial",  unitPrice: "$62.00",  amount: "$496.00",   mismatch: true  },
                    { qty: "4",  unit: "Case", desc: "Floor degreaser concentrate", unitPrice: "$95.00",  amount: "$380.00",   mismatch: false },
                    { qty: "4",  unit: "Each", desc: "Mop head replacement set",    unitPrice: "$275.00", amount: "$1,100.00", mismatch: false },
                    { qty: "10", unit: "Box",  desc: "Disposable gloves L",         unitPrice: "$18.50",  amount: "$185.00",   mismatch: false },
                    { qty: "1",  unit: "Fee",  desc: "Disposal / hazmat surcharge", unitPrice: "$88.00",  amount: "$88.00",    mismatch: true  },
                ],
                subtotal: "$4,450.00", shipping: "$0.00", tax: "$261.74", total: "$4,711.74",
                departments: [{ name: "F&B", account: "206355000", amount: "$4,711.74" }],
            },
        },
    },

    // Flow 4 — partial match (Cvent / S&M)
    "INV-SM-2217": {
        flow: 4,
        statusPill: { label: "Partial Match", cls: "review" },
        closestMatchBases: [
            { ref: "PO-25-0405", percent: "79% match", tone: "mid", desc: "Cvent event registration — Mar",  account: "206510000", amount: "$3,200.00", date: "Mar 08" },
            { ref: "PO-25-0388", percent: "65% match", tone: "mid", desc: "Cvent platform annual fee Q1",    account: "206510000", amount: "$3,588.40", date: "Feb 28" },
        ],
        poDetails: {
            "PO-25-0405": {
                poNumber: "SM0512", poDate: "05.03.2026", budgetClass: "Expense", accountNumber: "206510000",
                vendorShort: "Cvent Event Services", billedTo: BILLED_TO, lineMatch: "LN 3/5",
                mismatches: {
                    amount: { field: "Total amount", invoiceVal: "$3,588.40", poVal: "$3,200.00",            reason: "Invoice $388.40 above PO — possible scope add" },
                    extra:  { field: "Line 4",       invoiceVal: "Onsite support $250.00", poVal: "—",      reason: "Service not included in original PO scope" },
                    extra2: { field: "Line 5",       invoiceVal: "Express setup fee $138.40", poVal: "—",   reason: "Express fee not pre-approved" },
                },
                lineItems: [
                    { qty: "1", unit: "Event",  desc: "Event registration platform — March session",  unitPrice: "$1,800.00", amount: "$1,800.00", mismatch: false },
                    { qty: "1", unit: "Module", desc: "Attendee management module",                   unitPrice: "$900.00",   amount: "$900.00",   mismatch: false },
                    { qty: "1", unit: "Export", desc: "Data export package",                          unitPrice: "$500.00",   amount: "$500.00",   mismatch: false },
                    { qty: "1", unit: "Fee",    desc: "Onsite support — not on original PO",          unitPrice: "$250.00",   amount: "$250.00",   mismatch: true  },
                    { qty: "1", unit: "Fee",    desc: "Express setup fee — not pre-approved",         unitPrice: "$138.40",   amount: "$138.40",   mismatch: true  },
                ],
                subtotal: "$3,200.00", shipping: "$0.00", tax: "$388.40", total: "$3,588.40",
                departments: [{ name: "S&M", account: "206510000", amount: "$3,588.40" }],
            },
        },
    },

    // Flow 2 — over-budget (Otis Elevator)
    "INV-RM-1048": {
        flow: 2,
        statusPill: { label: "Over Budget", cls: "over-budget" },
        closestMatchBases: [
            { ref: "PO-25-0364", percent: "68% match", tone: "mid", desc: "Otis elevator maintenance contract", account: "106890000", amount: "$5,500.00", date: "Mar 07" },
            { ref: "PO-25-0377", percent: "55% match", tone: "mid", desc: "Elevator annual service — Otis",     account: "106890000", amount: "$4,800.00", date: "Feb 20" },
        ],
        poDetails: {
            "PO-25-0364": {
                poNumber: "RM0601", poDate: "01.03.2026", budgetClass: "Expense", accountNumber: "106890000",
                vendorShort: "Otis Elevator Company", billedTo: BILLED_TO, lineMatch: "LN 6/8",
                mismatches: {
                    amount:    { field: "Total amount", invoiceVal: "$6,188.77", poVal: "$5,500.00",           reason: "Invoice $688.77 over PO — emergency call-out fee added" },
                    overBudget:{ field: "Budget",       invoiceVal: "$6,188.77", poVal: "Budget: $5,800.00",   reason: "Exceeds R&M department budget by $388.77" },
                    extra:     { field: "Line 7",       invoiceVal: "Emergency call-out $450.00", poVal: "—", reason: "Emergency service not on original PO" },
                    extra2:    { field: "Line 8",       invoiceVal: "After-hours premium $238.77", poVal: "—",reason: "Not pre-approved" },
                },
                lineItems: [
                    { qty: "1", unit: "Month", desc: "Elevator maintenance — monthly contract",   unitPrice: "$2,200.00", amount: "$2,200.00", mismatch: false },
                    { qty: "1", unit: "Visit", desc: "Quarterly inspection visit",                unitPrice: "$850.00",   amount: "$850.00",   mismatch: false },
                    { qty: "2", unit: "Part",  desc: "Cable tension adjustment x2",               unitPrice: "$400.00",   amount: "$800.00",   mismatch: false },
                    { qty: "1", unit: "Kit",   desc: "Door sensor replacement kit",               unitPrice: "$750.00",   amount: "$750.00",   mismatch: false },
                    { qty: "2", unit: "Hour",  desc: "Labor — standard rate",                     unitPrice: "$225.00",   amount: "$450.00",   mismatch: false },
                    { qty: "1", unit: "Fee",   desc: "Parts handling & disposal",                 unitPrice: "$200.00",   amount: "$200.00",   mismatch: false },
                    { qty: "1", unit: "Call",  desc: "Emergency call-out — not on PO",           unitPrice: "$450.00",   amount: "$450.00",   mismatch: true  },
                    { qty: "1", unit: "Fee",   desc: "After-hours premium — not pre-approved",    unitPrice: "$238.77",   amount: "$238.77",   mismatch: true  },
                ],
                subtotal: "$5,500.00", shipping: "$0.00", tax: "$688.77", total: "$6,188.77",
                departments: [{ name: "R&M", account: "106890000", amount: "$6,188.77" }],
            },
        },
    },
};

// ── Public API ────────────────────────────────────────────────────────────────

export function getReviewData(invoiceId: string): ReviewData {
    const scenario = SCENARIOS[invoiceId];
    const flow: ReviewFlow  = scenario?.flow ?? 1;
    const statusPill        = scenario?.statusPill ?? { label: "Needs Review", cls: "needs-review" };

    const closestMatchBases = scenario?.closestMatchBases ?? [];
    const poDetails         = scenario?.poDetails ?? {};

    const closestMatches = closestMatchBases.map(base =>
        hydrate(base, poDetails[base.ref] ?? DEFAULT_PO_DETAIL)
    );

    const otherOpenPos = DEFAULT_OTHER_BASES.map(base =>
        hydrate(base, DEFAULT_PO_DETAIL)
    );

    const fileRef = `${invoiceId.replace(/^INV-/, "")}.pdf`;

    return { flow, fileRef, statusPill, closestMatches, otherOpenPos };
}