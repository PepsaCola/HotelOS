import { useEffect, useMemo, useState } from "react";
import type { ViewMode, LineItem, DepartmentAllocation } from "@/types/createPO";
import { createPODefaults } from "./data/createPOMock";
import { parseCurrency, parseQuantity, formatCurrency } from "./lib/po";

export function useCreatePO() {
    const d = createPODefaults;

    const [view, setView] = useState<ViewMode>("form");
    const [showToast, setShowToast] = useState(false);
    const [poNumber] = useState(d.poNumber);
    const [date, setDate] = useState(d.date);
    const [budgetClassification, setBudgetClassification] = useState(d.budgetClassification);
    const [accountNumber, setAccountNumber] = useState(d.accountNumber);
    const [billedTo, setBilledTo] = useState(d.billedTo);
    const [vendor, setVendor] = useState(d.vendor);
    const [shipping, setShipping] = useState(d.shipping);
    const [tax, setTax] = useState(d.tax);
    const [lineItems, setLineItems] = useState<LineItem[]>(d.lineItems);
    const [departments, setDepartments] = useState<DepartmentAllocation[]>(d.departments);

    useEffect(() => {
        if (!showToast) return;
        const timer = window.setTimeout(() => setShowToast(false), 2800);
        return () => window.clearTimeout(timer);
    }, [showToast]);

    const subtotal = useMemo(
        () => lineItems.reduce((sum, item) => sum + parseCurrency(item.amount), 0),
        [lineItems],
    );
    const total = subtotal + parseCurrency(shipping) + parseCurrency(tax);

    function updateLineItem(id: number, field: keyof LineItem, value: string) {
        setLineItems((cur) =>
            cur.map((item) => {
                if (item.id !== id) return item;
                const next = { ...item, [field]: value };
                if (field === "qty" || field === "unitPrice") {
                    const qty = field === "qty" ? parseQuantity(value) : parseQuantity(next.qty);
                    const up = field === "unitPrice" ? parseCurrency(value) : parseCurrency(next.unitPrice);
                    next.amount = qty > 0 && up > 0 ? formatCurrency(qty * up) : "";
                }
                return next;
            }),
        );
    }

    function addLineItem() {
        setLineItems((cur) => {
            const last = cur[cur.length - 1];
            return [
                ...cur,
                { id: last ? last.id + 1 : 1, qty: "", unit: "", description: "", unitPrice: "", amount: "" },
            ];
        });
    }

    function removeLineItem(id: number) {
        setLineItems((cur) => (cur.length === 1 ? cur : cur.filter((i) => i.id !== id)));
    }

    function updateDepartment(id: number, field: "account" | "amount", value: string) {
        setDepartments((cur) => cur.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
    }

    function resetForm() {
        setView("form");
        setDate(d.date);
        setBudgetClassification(d.budgetClassification);
        setAccountNumber(d.accountNumber);
        setBilledTo(d.billedTo);
        setVendor(d.vendor);
        setShipping(d.shipping);
        setTax(d.tax);
        setLineItems(d.lineItems);
        setDepartments(d.departments);
    }

    function handlePrimaryAction() {
        if (view === "form") { setView("preview"); return; }
        if (view === "preview") { setView("final"); setShowToast(true); }
    }

    return {
        view, setView,
        showToast,
        poNumber,
        date, setDate,
        budgetClassification, setBudgetClassification,
        accountNumber, setAccountNumber,
        billedTo, setBilledTo,
        vendor, setVendor,
        shipping, setShipping,
        tax, setTax,
        lineItems,
        departments,
        subtotal,
        total,
        updateLineItem,
        addLineItem,
        removeLineItem,
        updateDepartment,
        resetForm,
        handlePrimaryAction,
        primaryActionLabel: view === "form" ? "Preview & Submit" : "Create PO Order",
    };
}