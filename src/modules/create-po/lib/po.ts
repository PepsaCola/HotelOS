export function parseCurrency(value: string): number {
    const normalized = value.replace(/[^0-9.-]/g, "");
    const parsed = parseFloat(normalized);
    return isFinite(parsed) ? parsed : 0;
}

export function parseQuantity(value: string): number {
    const normalized = value.replace(/,/g, "").trim();
    const parsed = parseFloat(normalized);
    return isFinite(parsed) ? parsed : 0;
}

export function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
    }).format(value || 0);
}

export function formatDocumentDate(value: string): string {
    if (!value) return "";
    if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
        const [day, month, year] = value.split(".");
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    return value;
}

export function normalizeDeptValue(value: string, placeholder: string): string {
    const trimmed = value.trim();
    if (!trimmed || trimmed === placeholder) return "—";
    return trimmed;
}