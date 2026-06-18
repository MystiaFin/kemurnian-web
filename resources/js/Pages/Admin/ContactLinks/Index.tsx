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

interface Option {
    value: string;
    label: string;
}

export default function ContactLinksIndex({
    contactLinks,
    schoolGroups,
    schoolLevels,
}: {
    contactLinks: ItemContactLink[];
    schoolGroups: Option[];
    schoolLevels: Option[];
}) {
    const safeLinks = contactLinks || [];

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
            />
        </div>
    );
}

ContactLinksIndex.layout = (page: React.ReactNode) => <AdminLayout>{page}</AdminLayout>;
