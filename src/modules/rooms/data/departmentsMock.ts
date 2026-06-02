import type { DepartmentKey, ExpenseRow, RevenueRow, RoomsData } from '@/types/rooms';
import { ROOMS_MOCK } from './roomsMock';

/*
 * Every department page is the same template — only the data differs.
 * The Rooms department keeps its hand-authored dataset (ROOMS_MOCK); the other
 * five are assembled from a compact list of A/C lines and finalised by the
 * helpers below so totals, percentages and the footer stay internally consistent.
 */

const RN_SOLD = 9_435; // property-level rooms sold — shared $/night denominator
/** Property-level revenue lines (5 segments + Total Revenue), shared by every department. */
const BASE_REVENUE: RevenueRow[] = ROOMS_MOCK.revenue.filter((r) => !r.isExpense);

const round2 = (n: number) => Math.round(n * 100) / 100;

interface RawLine {
    name: string;
    code: string;
    budget: number;
    fixed?: number;
    w1?: number;
    w2?: number;
    w3?: number;
    w4?: number;
    w5?: number;
}

/** A zero-activity A/C line (no spend, no budget). */
const z = (name: string, code: string): RawLine => ({ name, code, budget: 0 });

function buildLine(raw: RawLine, revBase: number): ExpenseRow {
    const total = round2((raw.fixed ?? 0) + (raw.w1 ?? 0) + (raw.w2 ?? 0) + (raw.w3 ?? 0) + (raw.w4 ?? 0) + (raw.w5 ?? 0));
    const isZero = total === 0 && raw.budget === 0;
    const adjusted = round2(total * 0.9735);
    return {
        name: raw.name,
        code: raw.code,
        fixed: raw.fixed ?? null,
        w1: raw.w1 ?? null,
        w2: raw.w2 ?? null,
        w3: raw.w3 ?? null,
        w4: raw.w4 ?? null,
        w5: raw.w5 ?? null,
        total,
        totalPct: round2((total / revBase) * 100),
        budget: raw.budget,
        budgetPct: round2((raw.budget / revBase) * 100),
        perNight: total === 0 ? null : round2(total / RN_SOLD),
        variance: round2(raw.budget - total),
        adjusted,
        adjustedPct: round2((adjusted / revBase) * 100),
        isZero: isZero || undefined,
    };
}

function buildSubtotal(lines: ExpenseRow[], revBase: number): ExpenseRow {
    const sumWeek = (k: 'fixed' | 'w1' | 'w2' | 'w3' | 'w4' | 'w5') =>
        round2(lines.reduce((a, r) => a + (r[k] ?? 0), 0));
    const total = round2(lines.reduce((a, r) => a + r.total, 0));
    const budget = round2(lines.reduce((a, r) => a + r.budget, 0));
    return {
        name: 'Department Total',
        code: '—',
        fixed: sumWeek('fixed'),
        w1: sumWeek('w1'),
        w2: sumWeek('w2'),
        w3: sumWeek('w3'),
        w4: sumWeek('w4'),
        w5: sumWeek('w5'),
        total,
        totalPct: round2((total / revBase) * 100),
        budget,
        budgetPct: round2((budget / revBase) * 100),
        perNight: round2(total / RN_SOLD),
        variance: round2(budget - total),
        adjusted: total,
        adjustedPct: round2((total / revBase) * 100),
        isSubtotal: true,
    };
}

function buildDepartment(
    label: string,
    shortLabel: string,
    ledgerId: string,
    revBase: number,
    rawLines: RawLine[],
): RoomsData {
    const lines = rawLines.map((r) => buildLine(r, revBase));
    const subtotal = buildSubtotal(lines, revBase);
    const total = subtotal.total;
    const budget = subtotal.budget;

    const revenue: RevenueRow[] = [
        ...BASE_REVENUE,
        {
            label: `${shortLabel} Other Expenses`,
            hatch: Math.round(total),
            budget: Math.round(budget),
            variance: round2(((total - budget) / budget) * 100),
            dir: 'neg',
            isExpense: true,
        },
    ];

    return {
        property: { ...ROOMS_MOCK.property, department: label, ledgerId },
        metrics: ROOMS_MOCK.metrics,
        revenue,
        expenses: [...lines, subtotal],
        footer: {
            hatchForecasted: Math.round(total),
            adjustedToSpend: total,
            totalVsHatch: 0,
            glCloses: 'Jun 5',
            overBudget: Math.max(0, Math.round(total - budget)),
        },
    };
}

/* ─── F&B Department ──────────────────────────────────────────── */
const FB_LINES: RawLine[] = [
    { name: 'China, Glass & Silver',     code: '301225000', w5: 4200.00, budget: 4000.00 },
    { name: 'Cleaning Supplies',         code: '301226000', w2: 1200.00, w5: 3100.00, budget: 4100.00 },
    { name: 'Contract Services',         code: '301250000', fixed: 6500.00, w3: 800.00, budget: 7000.00 },
    z('Decorations',                     '301275000'),
    z('Dues and Subscriptions',          '301300000'),
    { name: 'Equipment Rental',          code: '301355000', w4: 1850.00, budget: 1800.00 },
    { name: 'Kitchen Fuel',              code: '301420000', w1: 900.00, w2: 950.00, w3: 980.00, w4: 1010.00, w5: 1040.00, budget: 4700.00 },
    { name: 'Laundry and Dry Cleaning',  code: '301530000', w5: 5200.00, budget: 5000.00 },
    z('Licenses and Permits',            '301545000'),
    { name: 'Linen',                     code: '301550000', w5: 6100.00, budget: 5900.00 },
    { name: 'Menus and Wine Lists',      code: '301585000', w5: 1450.00, budget: 1600.00 },
    z('Miscellaneous',                   '301590000'),
    { name: 'Operating Supplies',        code: '301620000', w5: 7300.00, budget: 7000.00 },
    { name: 'Paper and Plastic Supplies',code: '301650000', w2: 2100.00, w5: 4800.00, budget: 6500.00 },
    { name: 'Printing and Stationery',   code: '301710000', w5: 720.00, budget: 700.00 },
    z('Training',                        '301875000'),
    { name: 'Uniforms',                  code: '301900000', w5: 980.00, budget: 1100.00 },
    { name: 'Utensils',                  code: '301905000', w3: 1600.00, w5: 2200.00, budget: 3700.00 },
];

/* ─── A&G Department ──────────────────────────────────────────── */
const AG_LINES: RawLine[] = [
    { name: 'Bank Charges',                  code: '501205000', fixed: 1420.00, budget: 1400.00 },
    { name: 'Cash Over and Short',           code: '501210000', w5: 85.00, budget: 0 },
    { name: 'Contract Services',             code: '501250000', fixed: 3200.00, budget: 3150.00 },
    { name: 'Credit Card Commissions',       code: '501260000', fixed: 31800.00, budget: 31200.00 },
    z('Donations',                           '501290000'),
    { name: 'Dues and Subscriptions',        code: '501300000', w5: 940.00, budget: 1000.00 },
    z('Equipment Rental',                    '501355000'),
    { name: 'Human Resources',               code: '501470000', fixed: 2600.00, w4: 480.00, budget: 3000.00 },
    { name: 'Legal and Professional Fees',   code: '501540000', fixed: 4500.00, budget: 4200.00 },
    z('Licenses and Permits',                '501545000'),
    { name: 'Loss and Damage',               code: '501560000', w3: 620.00, budget: 500.00 },
    z('Miscellaneous',                       '501590000'),
    { name: 'Office Supplies',               code: '501615000', w2: 760.00, w5: 1240.00, budget: 2100.00 },
    { name: 'Postage and Overnight Delivery',code: '501700000', w5: 310.00, budget: 350.00 },
    { name: 'Printing and Stationery',       code: '501710000', w5: 540.00, budget: 520.00 },
    { name: 'Telephone — Administrative',    code: '501830000', fixed: 1880.00, budget: 1850.00 },
    { name: 'Training',                      code: '501875000', w4: 1100.00, budget: 1000.00 },
    { name: 'Travel — Meals and Entertainment', code: '501880000', w5: 670.00, budget: 800.00 },
    z('Travel — Other',                      '501885000'),
];

/* ─── IT Department ───────────────────────────────────────────── */
const IT_LINES: RawLine[] = [
    { name: 'Cloud and Hosting Services',          code: '601245000', fixed: 5400.00, budget: 5200.00 },
    { name: 'Contract Services',                   code: '601250000', fixed: 3100.00, w3: 600.00, budget: 3800.00 },
    { name: 'Equipment Rental',                    code: '601355000', w4: 1250.00, budget: 1200.00 },
    { name: 'Hardware — Non-Capital',              code: '601460000', w2: 2200.00, w5: 3400.00, budget: 5800.00 },
    { name: 'Internet and Bandwidth',              code: '601500000', fixed: 4200.00, budget: 4100.00 },
    z('Licenses and Permits',                      '601545000'),
    { name: 'Network Maintenance',                 code: '601600000', w1: 700.00, w3: 720.00, w5: 740.00, budget: 2100.00 },
    { name: 'Operating Supplies',                  code: '601620000', w5: 980.00, budget: 1000.00 },
    z('Printing and Stationery',                   '601710000'),
    { name: 'Software Licenses and Subscriptions', code: '601780000', fixed: 12600.00, budget: 12000.00 },
    { name: 'System Support and Maintenance',      code: '601820000', fixed: 3600.00, budget: 3500.00 },
    { name: 'Telephone — Administrative',          code: '601830000', fixed: 1640.00, budget: 1600.00 },
    { name: 'Telephone — Guest',                   code: '601835000', fixed: 2480.00, budget: 2600.00 },
    { name: 'Training',                            code: '601875000', w4: 850.00, budget: 800.00 },
    z('Travel — Other',                            '601885000'),
];

/* ─── S&M Department ──────────────────────────────────────────── */
const SM_LINES: RawLine[] = [
    { name: 'Advertising — Digital',          code: '401215000', fixed: 8600.00, w5: 1200.00, budget: 9500.00 },
    { name: 'Advertising — Print',            code: '401216000', w5: 2100.00, budget: 2300.00 },
    { name: 'Agency Fees',                    code: '401220000', fixed: 6000.00, budget: 6000.00 },
    { name: 'Collateral and Print Production',code: '401255000', w2: 1400.00, w5: 1900.00, budget: 3100.00 },
    { name: 'Commissions — OTA',              code: '401265000', fixed: 14800.00, budget: 14200.00 },
    { name: 'Dues and Subscriptions',         code: '401300000', w5: 760.00, budget: 800.00 },
    { name: 'Familiarization Trips',          code: '401410000', w3: 1850.00, budget: 1700.00 },
    { name: 'Loyalty Program Marketing',      code: '401565000', fixed: 4300.00, budget: 4200.00 },
    z('Miscellaneous',                        '401590000'),
    { name: 'Photography and Video',          code: '401680000', w4: 2400.00, budget: 2200.00 },
    { name: 'Printing and Stationery',        code: '401710000', w5: 620.00, budget: 600.00 },
    { name: 'Promotions and Giveaways',       code: '401720000', w2: 980.00, w5: 1640.00, budget: 2500.00 },
    { name: 'Public Relations',               code: '401725000', fixed: 2200.00, budget: 2300.00 },
    z('Training',                             '401875000'),
    { name: 'Trade Shows and Travel',         code: '401878000', w3: 3200.00, budget: 3000.00 },
    { name: 'Website and SEO',                code: '401910000', fixed: 3400.00, budget: 3300.00 },
];

/* ─── R&M Department ──────────────────────────────────────────── */
const RM_LINES: RawLine[] = [
    { name: 'Building Repairs',          code: '701230000', w2: 2600.00, w5: 4100.00, budget: 6500.00 },
    { name: 'Contract Services',         code: '701250000', fixed: 7800.00, w3: 900.00, budget: 8400.00 },
    { name: 'Electrical',                code: '701340000', w1: 1100.00, w4: 1700.00, budget: 2700.00 },
    { name: 'Elevators and Escalators',  code: '701345000', fixed: 3400.00, budget: 3300.00 },
    { name: 'Engineering Supplies',      code: '701350000', w5: 2900.00, budget: 2800.00 },
    z('Equipment Rental',                '701355000'),
    { name: 'Grounds and Landscaping',   code: '701450000', fixed: 2200.00, w4: 600.00, budget: 2900.00 },
    { name: 'HVAC Maintenance',          code: '701475000', w2: 1800.00, w5: 3300.00, budget: 4900.00 },
    { name: 'Kitchen Equipment Repairs', code: '701525000', w3: 1450.00, budget: 1300.00 },
    z('Licenses and Permits',            '701545000'),
    { name: 'Locks and Keys',            code: '701555000', w5: 640.00, budget: 700.00 },
    { name: 'Painting and Decorating',   code: '701660000', w4: 2100.00, budget: 2000.00 },
    { name: 'Plumbing',                  code: '701690000', w1: 900.00, w5: 2200.00, budget: 3000.00 },
    { name: 'Pool Maintenance',          code: '701695000', fixed: 1500.00, budget: 1450.00 },
    { name: 'Training',                  code: '701875000', w4: 720.00, budget: 800.00 },
    { name: 'Uniforms',                  code: '701900000', w5: 410.00, budget: 450.00 },
    { name: 'Waste Removal',             code: '701905000', fixed: 2650.00, budget: 2600.00 },
];

/* ─── Registry ────────────────────────────────────────────────── */
export const DEPARTMENTS_MOCK: Record<DepartmentKey, RoomsData> = {
    rooms: ROOMS_MOCK,
    fb: buildDepartment('F&B Department', 'F&B', '3', 274_985, FB_LINES),
    ag: buildDepartment('A&G Department', 'A&G', '4', 1_593_469, AG_LINES),
    it: buildDepartment('IT Department', 'IT', '5', 1_593_469, IT_LINES),
    sm: buildDepartment('S&M Department', 'S&M', '6', 1_593_469, SM_LINES),
    rm: buildDepartment('R&M Department', 'R&M', '7', 1_593_469, RM_LINES),
};
