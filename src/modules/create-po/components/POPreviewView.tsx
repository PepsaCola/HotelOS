import type { LineItem, DepartmentAllocation } from "@/types/createPO";
import PODocument from "./PODocument";

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

export default function POPreviewView(props: Props) {
    return (
        <div className="pb-4 sm:pb-8 w-full">
            <div className="mx-auto w-full">
                <PODocument {...props} />
            </div>
        </div>
    );
}