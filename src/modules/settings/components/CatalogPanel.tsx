import { INVENTORY_ROWS } from '../data/settingsMock';
import { Section, SectionHead, SearchInput, SettingsSelect, Btn } from './SettingsShared';

export function CatalogPanel() {
    return (
        <Section>
            <SectionHead
                title="Items / products table"
                sub="SKU, unit, price, linked vendor, and GL mapping."
                action={
                    <Btn size="sm" variant="primary" className="w-full sm:w-auto">
                        Add Item
                    </Btn>
                }
            />

            {/* ── Toolbar ── */}
            {/* Горизонтальний скрол для фільтрів, щоб уникнути хаосу при flex-wrap на вузьких екранах */}
            <div className="flex items-center gap-2 sm:gap-3 border-b border-hair-2 px-3 sm:px-5 py-2.5 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">

                {/* Фіксована ширина пошуку на мобільному, гнучка на ПК */}
                <div className="w-[220px] shrink-0 sm:w-auto sm:flex-1 sm:min-w-[200px]">
                    <SearchInput placeholder="Search items…" />
                </div>

                <div className="shrink-0">
                    <SettingsSelect>
                        <option>All categories</option>
                        <option>Amenities</option>
                        <option>Produce</option>
                        <option>Service</option>
                    </SettingsSelect>
                </div>

                <div className="shrink-0">
                    <SettingsSelect>
                        <option>All vendors</option>
                        <option>Atlantic Textiles</option>
                        <option>Fresh Market Provisions</option>
                    </SettingsSelect>
                </div>
            </div>

            {/* ── Table ── */}
            {/* Плавний скрол для широкої таблиці */}
            <div className="overflow-x-auto w-full [-webkit-overflow-scrolling:touch]">
                <table className="w-full min-w-[700px] border-collapse text-[12.5px] sm:text-[13px]">
                    <thead>
                    <tr className="border-b border-hair-2 bg-surface-soft">
                        {['SKU / Item Code', 'Description', 'Unit', 'Default Price', 'Linked Vendor', 'GL Mapping', ''].map((h, i) => (
                            <th
                                key={i}
                                className={`px-3.5 sm:px-4 py-2.5 text-left text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[.06em] text-muted whitespace-nowrap ${i === 6 ? 'text-right' : ''}`}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {INVENTORY_ROWS.map(row => (
                        <tr key={row.sku} className="border-b border-hair last:border-0 hover:bg-surface-soft/50 transition-colors">
                            <td className="px-3.5 sm:px-4 py-2.5 font-mono text-[11.5px] sm:text-[12px] text-ink-700 whitespace-nowrap">
                                {row.sku}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5">
                                <p className="font-semibold text-ink-900">{row.name}</p>
                                <p className="mt-0.5 text-[11px] sm:text-[11.5px] text-muted">Category: {row.category}</p>
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 text-ink-700 whitespace-nowrap">
                                {row.unit}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 font-semibold tabular-nums text-ink-900 whitespace-nowrap">
                                {row.price}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 text-ink-700 whitespace-nowrap">
                                {row.vendor}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 font-mono text-[11.5px] sm:text-[12px] text-muted whitespace-nowrap">
                                {row.gl}
                            </td>
                            <td className="px-3.5 sm:px-4 py-2.5 text-right">
                                <button
                                    aria-label="More actions"
                                    className="ml-auto flex h-7 w-7 flex-col items-center justify-center gap-[3px] rounded-md hover:bg-surface-soft transition-colors"
                                >
                                    {[0,1,2].map(i => <span key={i} className="h-[3px] w-[3px] rounded-full bg-muted-strong" />)}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </Section>
    );
}