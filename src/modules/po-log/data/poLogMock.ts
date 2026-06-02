import type { POLogData, PODeptId, PODepartment, POStatus, StatusMeta, PurchaseOrderRecord } from "@/types/poLog";

const departments: Record<PODeptId, PODepartment> = {
  rooms: { id: "rooms", name: "Rooms", short: "RM", color: "#4a78f0" },
  fb:    { id: "fb",    name: "F&B",   short: "FB", color: "#e88a3c" },
  ag:    { id: "ag",    name: "A&G",   short: "AG", color: "#7a6df0" },
  it:    { id: "it",    name: "IT",    short: "IT", color: "#119da4" },
  sm:    { id: "sm",    name: "S&M",   short: "SM", color: "#c7458a" },
  rm:    { id: "rm",    name: "R&M",   short: "RM", color: "#38a169" },
};

const statusMeta: Record<POStatus, StatusMeta> = {
  fixed: { label: "Fixed", tone: "good" },
  received: { label: "Received", tone: "good" },
  pending: { label: "Pending", tone: "warn" },
  partial: { label: "Partial", tone: "warn" },
  overdue: { label: "Overdue", tone: "crit" },
  draft: { label: "Draft", tone: "neutral" },
};

const orders: PurchaseOrderRecord[] = [
  // Rooms
  { po: "RM0509", ac: "106250000", desc: "Yearly Carpet Refresh — Floors 4–7", vendor: "Clean Tec", dept: "rooms", amt: 2200.0, status: "fixed", date: "Apr 02", due: "Apr 30" },
  { po: "RM0510", ac: "106730000", desc: "Main Office Operating Lease", vendor: "Hilton Inc.", dept: "rooms", amt: 2547.45, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "RM0511", ac: "106890000", desc: "Travel Agent Commission — Groups", vendor: "Expedia TAAP", dept: "rooms", amt: 5128.55, status: "received", date: "Apr 04", due: "—" },
  { po: "RM0512", ac: "106895000", desc: "Travel Agent Commission — Individual", vendor: "Booking.com", dept: "rooms", amt: 21684.0, status: "received", date: "Apr 04", due: "—" },
  { po: "RM0513", ac: "106895000", desc: "Travel Agent Commission — Airlines", vendor: "Sabre GDS", dept: "rooms", amt: 36637.0, status: "received", date: "Apr 04", due: "—" },
  { po: "RM0514", ac: "106120000", desc: "Guest Amenity Kits (250 ct)", vendor: "Restoration Hardware Hosp.", dept: "rooms", amt: 4280.0, status: "partial", date: "Apr 06", due: "Apr 22" },
  { po: "RM0515", ac: "106440000", desc: "Linen Service — Monthly Contract", vendor: "Cintas Hospitality", dept: "rooms", amt: 8945.0, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "RM0516", ac: "106220000", desc: "Replacement Mattresses (Topaz Suite)", vendor: "Sealy Commercial", dept: "rooms", amt: 14250.0, status: "pending", date: "Apr 09", due: "Apr 25" },
  { po: "RM0517", ac: "106310000", desc: "Housekeeping Supplies — Apr Refill", vendor: "Ecolab Inc.", dept: "rooms", amt: 3884.2, status: "received", date: "Apr 11", due: "—" },

  // Food & Beverage
  { po: "FB0303", ac: "206355000", desc: "Equipment Rental Fee (Contract #1000676117)", vendor: "Ecolab Inc.", dept: "fb", amt: 234.13, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "FB0304", ac: "206355000", desc: "Glass Washer Rental (Contract #1001124755)", vendor: "Ecolab Inc.", dept: "fb", amt: 169.79, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "FB0305", ac: "206355000", desc: "Dishwashing Machine Rental (Contract #1001420823)", vendor: "Ecolab Inc.", dept: "fb", amt: 365.72, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "FB0306", ac: "201100000", desc: "Wine Replenishment — Cellar (Q2)", vendor: "Southern Glazers", dept: "fb", amt: 18420.0, status: "pending", date: "Apr 10", due: "Apr 28" },
  { po: "FB0307", ac: "201200000", desc: "Weekly Produce Order — Week 14", vendor: "Sysco Foods", dept: "fb", amt: 6240.55, status: "received", date: "Apr 03", due: "—" },
  { po: "FB0308", ac: "201200000", desc: "Weekly Produce Order — Week 15", vendor: "Sysco Foods", dept: "fb", amt: 6510.8, status: "received", date: "Apr 10", due: "—" },
  { po: "FB0309", ac: "201400000", desc: "Banquet Linens — Special Event", vendor: "Cintas Hospitality", dept: "fb", amt: 1850.0, status: "received", date: "Apr 12", due: "—" },
  { po: "FB0310", ac: "202300000", desc: "Espresso Machine Service & Calibration", vendor: "La Marzocco Cafe", dept: "fb", amt: 725.0, status: "overdue", date: "Mar 28", due: "Apr 11" },
  { po: "FB0311", ac: "201500000", desc: "Seafood Order — Easter Weekend", vendor: "Pacific Seafood Group", dept: "fb", amt: 9840.32, status: "partial", date: "Apr 13", due: "Apr 18" },

  // Engineering
  { po: "EN0188", ac: "306700000", desc: "HVAC Quarterly Maintenance", vendor: "Trane Service Co.", dept: "rm", amt: 4350.0, status: "received", date: "Apr 02", due: "—" },
  { po: "EN0189", ac: "306710000", desc: "Elevator Inspection & Permit Renewal", vendor: "Otis Worldwide", dept: "rm", amt: 2940.0, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "EN0190", ac: "306820000", desc: "Pool Chemicals & Filter Cartridges", vendor: "BioGuard Commercial", dept: "rm", amt: 1620.45, status: "received", date: "Apr 05", due: "—" },
  { po: "EN0191", ac: "306500000", desc: "Boiler Repair — Tower B (Emergency)", vendor: "Johnson Controls", dept: "rm", amt: 54320.0, status: "pending", date: "Apr 08", due: "Apr 20" },
  { po: "EN0192", ac: "306330000", desc: "LED Lamp Replacement Stock (Q2)", vendor: "Phillips Hospitality", dept: "rm", amt: 3240.0, status: "received", date: "Apr 09", due: "—" },
  { po: "EN0193", ac: "306900000", desc: "Pest Control — Monthly", vendor: "Orkin Commercial", dept: "rm", amt: 540.0, status: "fixed", date: "Apr 01", due: "Apr 30" },

  // Admin & G&A
  { po: "AD0072", ac: "406100000", desc: "Property Management Software — Apr", vendor: "Oracle Opera Cloud", dept: "ag", amt: 6850.0, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "AD0073", ac: "406200000", desc: "Outside Audit — Q1 Engagement", vendor: "PwC LLP", dept: "ag", amt: 28500.0, status: "pending", date: "Apr 04", due: "May 04" },
  { po: "AD0074", ac: "406410000", desc: "Office Supplies — General", vendor: "Staples Business", dept: "ag", amt: 412.66, status: "received", date: "Apr 07", due: "—" },
  { po: "AD0075", ac: "406510000", desc: "Legal Retainer — Apr", vendor: "Greenberg Traurig", dept: "ag", amt: 5000.0, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "AD0076", ac: "406700000", desc: "GM Travel — Industry Conference", vendor: "Concur T&E", dept: "ag", amt: 3284.5, status: "overdue", date: "Mar 22", due: "Apr 06" },

  // Sales & Marketing
  { po: "SM0044", ac: "506200000", desc: "Spring Campaign — Digital Spend", vendor: "Google Ads", dept: "sm", amt: 12500.0, status: "received", date: "Apr 01", due: "—" },
  { po: "SM0045", ac: "506220000", desc: "Meta Retargeting — Apr", vendor: "Meta Platforms", dept: "sm", amt: 4800.0, status: "received", date: "Apr 01", due: "—" },
  { po: "SM0046", ac: "506310000", desc: "Trade Show Booth — IMEX Frankfurt", vendor: "GES Events", dept: "sm", amt: 18250.0, status: "pending", date: "Apr 06", due: "Apr 30" },
  { po: "SM0047", ac: "506400000", desc: "Brand Photography — Suite Refresh", vendor: "Hayes Studios", dept: "sm", amt: 6400.0, status: "partial", date: "Apr 09", due: "Apr 24" },
  { po: "SM0048", ac: "506110000", desc: "Loyalty Program Rebate — Apr", vendor: "Marriott Bonvoy", dept: "sm", amt: 8920.4, status: "fixed", date: "Apr 01", due: "Apr 30" },

  // Spa
  { po: "SP0021", ac: "606100000", desc: "Treatment Products — Monthly Refill", vendor: "Aveda Professional", dept: "it", amt: 3720.0, status: "received", date: "Apr 04", due: "—" },
  { po: "SP0022", ac: "606200000", desc: "Robe & Towel Service", vendor: "Cintas Hospitality", dept: "it", amt: 1290.0, status: "fixed", date: "Apr 01", due: "Apr 30" },
  { po: "SP0023", ac: "606300000", desc: "Therapist Liability Insurance", vendor: "AON Risk", dept: "it", amt: 880.0, status: "fixed", date: "Apr 01", due: "Apr 30" },
];

export const poLogMock: POLogData = {
  meta: {
    monthLabel: "April 2026",
    closesLabel: "period closes May 5",
    monthBudget: 760000,
  },
  departments,
  statusMeta,
  orders,
};
