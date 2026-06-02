import type {
    SectionNavItem, SectionMeta, PropertyRow, DepartmentRow,
    UserRow, AccountRow, InventoryItem, LogRow, TaxProfileRow, TaxExemptionRow,
} from '@/types/settings';

export const SECTION_NAV: ReadonlyArray<SectionNavItem> = [
    { id: 'profile',     label: 'Profile Settings',  group: 'Account',      icon: 'profile'  },
    { id: 'property',    label: 'Properties',         group: 'Workspace',    icon: 'property' },
    { id: 'departments', label: 'Departments',         group: 'Workspace',    icon: 'grid',    count: 6 },
    { id: 'users',       label: 'Users & Roles',       group: 'Workspace',    icon: 'users',   count: 3 },
    { id: 'gl',          label: 'Account Numbers',     group: 'Finance',      icon: 'gl',      count: 30 },
    { id: 'tax',         label: 'Tax Profiles',        group: 'Finance',      icon: 'tax'      },
    { id: 'catalog',     label: 'Inventory',           group: 'Finance',      icon: 'catalog', count: 4 },
    { id: 'm3',          label: 'M3 Mapping',          group: 'Integrations', icon: 'code'     },
    { id: 'profitsword', label: 'Profitsword',         group: 'Integrations', icon: 'chart'    },
];

export const SECTION_META: Record<string, SectionMeta> = {
    profile:     { title: 'Profile Settings',                   subtitle: 'Personal account information, security, notification preferences, and workspace defaults.' },
    property:    { title: 'Properties',                         subtitle: 'Single-property setup for the active hotel record.' },
    departments: { title: 'Departments Management',             subtitle: 'Department hierarchy, ownership, linked properties, and department-level actions.' },
    users:       { title: 'Users & Roles',                      subtitle: 'User access, role coverage, permission visibility, and selected user details.' },
    gl:          { title: 'Account Numbers',                    subtitle: 'Account setup for the active property, organized by account number, account name, and department.' },
    tax:         { title: 'Tax Profiles',                       subtitle: 'Tax rates, region rules, default flags, and exemption handling.' },
    catalog:     { title: 'Inventory',                          subtitle: 'Vendor master data, contracts, contact information, and linked item setup.' },
    m3:          { title: 'M3 Mapping Configuration',           subtitle: 'Mapping setup, validation, export preview, and sync or error tracking.' },
    profitsword: { title: 'Profitsword Import / Sync Settings', subtitle: 'Sync status, import history, mapping, budget import rules, and warning or error review.' },
};

export const PROPERTY_ROWS: ReadonlyArray<PropertyRow> = [
    {
        initials: 'D',
        name:     'DoubleTree by Hilton Hotel Orlando Airport',
        code:     '021',
        location: 'Orlando, Florida',
        meta:     'EST · USD',
        status:   'Active',
    },
];

export const DEPARTMENT_ROWS: ReadonlyArray<DepartmentRow> = [
    { initials: 'RM', accent: 'rooms', name: 'Rooms', code: 'RMS', manager: 'Lisa Park',     property: 'DoubleTree by Hilton Hotel Orlando Airport', budgetOwner: 'Rachel Torres' },
    { initials: 'FB', accent: 'fb',    name: 'F&B',   code: 'FNB', manager: 'Sandra K.',     property: 'DoubleTree by Hilton Hotel Orlando Airport', budgetOwner: 'Marcus Lane'   },
    { initials: 'AG', accent: 'admin', name: 'A&G',   code: 'AGD', manager: 'Rachel Torres', property: 'DoubleTree by Hilton Hotel Orlando Airport', budgetOwner: 'Rachel Torres' },
    { initials: 'IT', accent: 'eng',   name: 'IT',    code: 'ITS', manager: 'David Kim',     property: 'DoubleTree by Hilton Hotel Orlando Airport', budgetOwner: 'Marcus Lane'   },
    { initials: 'SM', accent: 'sales', name: 'S&M',   code: 'SMK', manager: 'Tom Walsh',     property: 'DoubleTree by Hilton Hotel Orlando Airport', budgetOwner: 'Marcus Lane'   },
    { initials: 'RM', accent: 'spa',   name: 'R&M',   code: 'RNM', manager: 'James Ortiz',   property: 'DoubleTree by Hilton Hotel Orlando Airport', budgetOwner: 'Rachel Torres' },
];

export const USER_ROWS: ReadonlyArray<UserRow> = [
    { initials: 'JS',                  name: 'John Smith',  email: 'john.smith@example.com',      role: 'Admin',     property: 'All properties',                         department: 'All departments',   status: 'Active',  highlight: true, cta: 'Edit'          },
    { initials: 'SK', accent: 'fb',    name: 'Sandra K.',   email: 'sandra@grandmeridian.com',     role: 'Dept Head', property: 'Grand Meridian Hotel',                   department: 'Food & Beverage',   status: 'Active',               cta: 'Edit'          },
    { initials: 'AN', accent: 'spa',   name: 'Aisha Nkosi', email: 'aisha@grandmeridian.com',      role: 'Controller',property: 'South Harbor Suites',                    department: 'Admin & G&A',       status: 'Pending',              cta: 'Resend invite' },
];

export const ACCOUNT_ROWS: ReadonlyArray<AccountRow> = [
    { accountNumber: '103000700', accountName: 'Transient-Corporate',                   department: 'ROOMS' },
    { accountNumber: '103000750', accountName: 'Transient-Advanced Purchase',            department: 'ROOMS' },
    { accountNumber: '103000800', accountName: 'Transient-Qualified Discounts',          department: 'ROOMS' },
    { accountNumber: '103000850', accountName: 'Transient-FIT(Flexible Independent)',    department: 'ROOMS' },
    { accountNumber: '103000900', accountName: 'Transient-Consortia',                   department: 'ROOMS' },
    { accountNumber: '103000950', accountName: 'Transient-Employee',                    department: 'ROOMS' },
    { accountNumber: '103001100', accountName: 'Transient-Leisure',                     department: 'ROOMS' },
    { accountNumber: '103001150', accountName: 'Transient-Travel Agent/Friends',        department: 'ROOMS' },
    { accountNumber: '103001200', accountName: 'Transient-Leisure Package',             department: 'ROOMS' },
    { accountNumber: '103001250', accountName: 'Transient-Member Reward Stay',          department: 'ROOMS' },
    { accountNumber: '103001350', accountName: 'Transient-Non-Qualified Discounts',     department: 'ROOMS' },
    { accountNumber: '103001400', accountName: 'Transient-Internet/E-Commerce',         department: 'ROOMS' },
    { accountNumber: '103001450', accountName: 'Transient-E-Commerce Opaque',           department: 'ROOMS' },
    { accountNumber: '103001500', accountName: 'Transient-Other',                       department: 'ROOMS' },
    { accountNumber: '103001550', accountName: 'Transient-Airline Distressed',          department: 'ROOMS' },
    { accountNumber: '103010200', accountName: 'Transient-Government',                  department: 'ROOMS' },
    { accountNumber: '103010300', accountName: 'Transient-Rack',                        department: 'ROOMS' },
    { accountNumber: '103010500', accountName: 'Transient-Local Negotiated',            department: 'ROOMS' },
    { accountNumber: '103111300', accountName: 'Group-Corporate',                       department: 'ROOMS' },
    { accountNumber: '103111400', accountName: 'Group-Leisure',                         department: 'ROOMS' },
    { accountNumber: '103111500', accountName: 'Group-Government',                      department: 'ROOMS' },
    { accountNumber: '103111600', accountName: 'Group-Tour/Wholesalers',                department: 'ROOMS' },
    { accountNumber: '103111700', accountName: 'Group-Association/Convention',          department: 'ROOMS' },
    { accountNumber: '103111800', accountName: 'Group-Wedding',                         department: 'ROOMS' },
    { accountNumber: '103112000', accountName: 'Group-SMERF',                           department: 'ROOMS' },
    { accountNumber: '103112100', accountName: 'Group-Sports',                          department: 'ROOMS' },
    { accountNumber: '103213100', accountName: 'Contract-Airline Crews',                department: 'ROOMS' },
    { accountNumber: '103213200', accountName: 'Contract-Other',                        department: 'ROOMS' },
    { accountNumber: '103313100', accountName: 'Revenue-No-Show Rooms',                 department: 'ROOMS' },
    { accountNumber: '103313900', accountName: 'Revenue-Allowance',                     department: 'ROOMS' },
];

export const INVENTORY_ROWS: ReadonlyArray<InventoryItem> = [
    { sku: 'RMS-AME-001', name: 'Bath towels',              category: 'Amenities',    unit: 'Each',   price: '$12.50',  vendor: 'Atlantic Textiles',      gl: '106120000' },
    { sku: 'RMS-CLE-014', name: 'Glass cleaner concentrate',category: 'Housekeeping', unit: 'Bottle', price: '$8.90',   vendor: 'CleanSource Supply',     gl: '106145000' },
    { sku: 'FNB-PRD-001', name: 'Seasonal produce order',   category: 'Produce',      unit: 'Order',  price: '$340.00', vendor: 'Fresh Market Provisions', gl: '201200000' },
    { sku: 'FNB-BEV-022', name: 'Sparkling water case',     category: 'Beverage',     unit: 'Case',   price: '$21.75',  vendor: 'Fresh Market Provisions', gl: '201315000' },
];

export const TAX_PROFILES: ReadonlyArray<TaxProfileRow> = [
    { initials: '7%', accent: 'green', name: 'Florida Resort Tax',    region: 'Miami Beach, FL',  type: 'Sales tax',     badge: { tone: 'indigo', label: 'Default' } },
    { initials: '5%', accent: 'dark',  name: 'City Occupancy Tax',    region: 'Savannah, GA',     type: 'Occupancy tax', badge: { tone: 'good',   label: 'Active'  } },
];

export const TAX_EXEMPTIONS: ReadonlyArray<TaxExemptionRow> = [
    { initials: 'EX', name: 'Wholesale beverage vendors', parts: ['GL 2010-2019', '0% override'] },
    { initials: 'SP', name: 'Spa promotional gift cards', parts: ['Special tax type', 'Manual review required'] },
];

export const M3_LOG_ROWS: ReadonlyArray<LogRow> = [
    { initials: 'OK', tone: 'good', title: 'Validation run complete', meta: ['May 22 · 09:14', '24 passed · 2 warnings · 1 error'],    action: 'View' },
    { initials: 'WR', tone: 'warn', title: 'Nightly export test',     meta: ['May 21 · 02:04', 'Fallback used for one cost center'],    action: 'View' },
];

export const PS_IMPORT_LOG: ReadonlyArray<LogRow> = [
    { initials: 'OK', tone: 'good', title: 'May 2026 - Full P&L Forecast',   meta: ['May 15 · 02:04 AM', 'profitsword-may2026.csv', '1,248 lines'], action: 'View' },
    { initials: 'OK', tone: 'good', title: 'April 2026 - Full P&L Forecast', meta: ['Apr 1 · 01:58 AM',  'profitsword-apr2026.csv', '1,231 lines'], action: 'View' },
];

export const PS_ERROR_LOG: ReadonlyArray<LogRow> = [
    { initials: 'WR', tone: 'warn', title: 'Mid-month update warning', meta: ['Mar 15 · 03:12 AM', '4 mapping warnings - Spa GL unmatched'], action: 'View warnings' },
    { initials: 'ER', tone: 'crit', title: 'Budget import failed',     meta: ['Feb 1 · 02:01 AM',  'File header mismatch on BUDGET_AMT'],   action: 'View errors'   },
];