import { Head } from '@inertiajs/react';
import ContactLinksList from '@AdminComponents/ContactLinksList';
import ActionButton from '@AdminComponents/ActionButton';
import AdminLayout from '@/Layouts/AdminLayout';

interface ItemContactLink {
    id: number;
    name: string;
    school_group: string;
    school_level: string;
    url: string;
}

interface ClickStat {
    name: string;
    total_clicks: number;
}

interface Option {
    value: string;
    label: string;
}

export default function ContactLinksIndex({
    contactLinks,
    schoolGroups,
    schoolLevels,
    clickStats,
    sortBy = 'name',
    sortOrder = 'asc',
}: {
    contactLinks: ItemContactLink[];
    schoolGroups: Option[];
    schoolLevels: Option[];
    clickStats: ClickStat[];
    sortBy?: string;
    sortOrder?: string;
}) {
    const safeLinks = contactLinks || [];
    const stats = clickStats || [];
    const maxClicks = Math.max(...stats.map((s) => s.total_clicks), 1);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <Head title="Contact Links" />

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Contact Links</h1>
                <ActionButton href="/admin/contact-links/create" label="+ Create Entry" />
            </div>

            <ContactLinksList
                links={safeLinks}
                schoolGroups={schoolGroups}
                schoolLevels={schoolLevels}
                sortBy={sortBy}
                sortOrder={sortOrder}
            />

            <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Click Stats</h2>
                {stats.length === 0 ? (
                    <p className="text-gray-500">No click data yet.</p>
                ) : (
                    <div className="space-y-2">
                        {stats.map((stat) => (
                            <div key={stat.name} className="flex items-center gap-3">
                                <span className="w-48 text-sm text-gray-700 truncate shrink-0" title={stat.name}>
                                    {stat.name}
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-6 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full rounded-full transition-all"
                                        style={{ width: `${(stat.total_clicks / maxClicks) * 100}%` }}
                                    />
                                </div>
                                <span className="w-12 text-sm text-gray-600 text-right shrink-0">
                                    {stat.total_clicks}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

ContactLinksIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
