export type SettingsSectionId =
    | 'profile'
    | 'property'
    | 'departments'
    | 'users'
    | 'gl'
    | 'tax'
    | 'catalog'
    | 'm3'
    | 'profitsword';

export type SettingsGroup = 'Account' | 'Workspace' | 'Finance' | 'Integrations';

export type BadgeTone    = 'good' | 'warn' | 'crit' | 'neutral' | 'indigo';
export type StatTone     = 'good' | 'warn' | 'crit' | 'default';
export type AvatarAccent = 'brand' | 'rooms' | 'fb' | 'admin' | 'eng' | 'sales' | 'spa' | 'good' | 'warn' | 'crit' | 'neutral' | 'green' | 'dark';
export type IconKind     = 'profile' | 'property' | 'grid' | 'users' | 'gl' | 'tax' | 'catalog' | 'code' | 'chart';

export interface SectionNavItem {
    id:     SettingsSectionId;
    label:  string;
    group:  SettingsGroup;
    count?: number;
    icon:   IconKind;
}

export interface SectionMeta {
    title:    string;
    subtitle: string;
}

export interface ProfileForm {
    name:  string;
    email: string;
    phone: string;
}

export interface PropertyRow {
    initials: string;
    name:     string;
    code:     string;
    location: string;
    meta:     string;
    status:   string;
}

export interface DepartmentRow {
    initials:    string;
    accent:      AvatarAccent;
    name:        string;
    code:        string;
    manager:     string;
    property:    string;
    budgetOwner: string;
}

export interface UserRow {
    initials:   string;
    accent?:    AvatarAccent;
    name:       string;
    email:      string;
    role:       string;
    property:   string;
    department: string;
    status:     'Active' | 'Pending';
    highlight?: boolean;
    cta:        string;
}

export interface AccountRow {
    accountNumber: string;
    accountName:   string;
    department:    string;
}

export interface InventoryItem {
    sku:      string;
    name:     string;
    category: string;
    unit:     string;
    price:    string;
    vendor:   string;
    gl:       string;
}

export interface LogRow {
    initials: string;
    tone:     'good' | 'warn' | 'crit';
    title:    string;
    meta:     string[];
    action:   string;
}

export interface TaxProfileRow {
    initials: string;
    accent:   AvatarAccent;
    name:     string;
    region:   string;
    type:     string;
    badge:    { tone: BadgeTone; label: string };
}

export interface TaxExemptionRow {
    initials: string;
    name:     string;
    parts:    string[];
}

export interface NotificationToggles {
    approvals:  boolean;
    exceptions: boolean;
    digest:     boolean;
}

export interface IntegrationToggles {
    m3:          boolean;
    profitsword: boolean;
}