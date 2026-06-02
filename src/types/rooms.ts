export type WeekKey = 'fixed' | 'w1' | 'w2' | 'w3' | 'w4' | 'w5';
export type VarianceDir = 'pos' | 'neg' | 'flat';

/** The six operating departments, each rendered with the same page template. */
export type DepartmentKey = 'rooms' | 'fb' | 'ag' | 'it' | 'sm' | 'rm';

export interface RoomsProperty {
    name:            string;
    department:      string;
    keys:            number;
    hierarchy:       string;
    monthNum:        number;
    monthName:       string;
    m3Tag:           string;
    ledgerId:        string;
    weekType:        string;
    periodLabel:     string;
    closesDate:      string;
    lastRefresh:     string;
}

export interface MetricRow {
    label:    string;
    hatch:    string;
    budget:   string;
    hatchDir: 'up' | 'down' | null;
}

export interface RevenueRow {
    label:     string;
    hatch:     number;
    budget:    number;
    variance:  number;   // percent
    dir:       VarianceDir;
    isTotal?:  boolean;
    isExpense?: boolean;
}

export interface ExpenseRow {
    name:         string;
    code:         string;
    fixed:        number | null;
    w1:           number | null;
    w2:           number | null;
    w3:           number | null;
    w4:           number | null;
    w5:           number | null;
    total:        number;
    totalPct:     number;
    budget:       number;
    budgetPct:    number;
    perNight:     number | null;
    variance:     number;
    adjusted:     number;
    adjustedPct:  number;
    isZero?:      boolean;
    isSubtotal?:  boolean;
}

export interface RoomsFooter {
    hatchForecasted: number;
    adjustedToSpend: number;
    totalVsHatch:    number;
    glCloses:        string;
    overBudget:      number;
}

export interface RoomsData {
    property:    RoomsProperty;
    metrics:     MetricRow[];
    revenue:     RevenueRow[];
    expenses:    ExpenseRow[];
    footer:      RoomsFooter;
}