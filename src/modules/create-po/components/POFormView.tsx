import type { LineItem, DepartmentAllocation } from "@/types/createPO";
import POInformationSection from "./POInformationSection";
import ShippingSection from "./ShippingSection";
import LineItemsSection from "./LineItemsSection";
import DepartmentsSection from "./DepartmentsSection";

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
    subtotal: number;
    total: number;
    onDateChange: (v: string) => void;
    onBudgetClassificationChange: (v: string) => void;
    onAccountNumberChange: (v: string) => void;
    onBilledToChange: (v: string) => void;
    onVendorChange: (v: string) => void;
    onShippingChange: (v: string) => void;
    onTaxChange: (v: string) => void;
    onUpdateLineItem: (id: number, field: keyof LineItem, value: string) => void;
    onAddLineItem: () => void;
    onRemoveLineItem: (id: number) => void;
    onUpdateDepartment: (id: number, field: "account" | "amount", value: string) => void;
}

export default function POFormView({
                                       poNumber, date, budgetClassification, accountNumber,
                                       billedTo, vendor, shipping, tax, lineItems, departments,
                                       subtotal, total,
                                       onDateChange, onBudgetClassificationChange, onAccountNumberChange,
                                       onBilledToChange, onVendorChange, onShippingChange, onTaxChange,
                                       onUpdateLineItem, onAddLineItem, onRemoveLineItem, onUpdateDepartment,
                                   }: Props) {
    return (
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 space-y-4 sm:space-y-5 py-4 sm:py-5 pb-10">
            <POInformationSection
                poNumber={poNumber}
                date={date}
                budgetClassification={budgetClassification}
                accountNumber={accountNumber}
                onDateChange={onDateChange}
                onBudgetClassificationChange={onBudgetClassificationChange}
                onAccountNumberChange={onAccountNumberChange}
            />
            <ShippingSection
                billedTo={billedTo}
                vendor={vendor}
                onBilledToChange={onBilledToChange}
                onVendorChange={onVendorChange}
            />
            <LineItemsSection
                lineItems={lineItems}
                subtotal={subtotal}
                total={total}
                shipping={shipping}
                tax={tax}
                onUpdateLineItem={onUpdateLineItem}
                onAddLineItem={onAddLineItem}
                onRemoveLineItem={onRemoveLineItem}
                onShippingChange={onShippingChange}
                onTaxChange={onTaxChange}
            />
            <DepartmentsSection
                departments={departments}
                onUpdate={onUpdateDepartment}
            />
        </div>
    );
}