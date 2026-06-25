import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { RiSortAsc, RiSortDesc } from '@remixicon/react';
import LinkRow from './LinkRow';

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

interface Props {
    links: ItemContactLink[];
    schoolGroups: Option[];
    schoolLevels: Option[];
    sortBy?: string;
    sortOrder?: string;
}

export default function ContactLinksList({ links, schoolGroups, schoolLevels, sortBy = 'name', sortOrder = 'asc' }: Props) {
    const [editingId, setEditingId] = useState<number | null>(null);

    const form = useForm({
        name: '',
        school_group: '',
        school_level: '',
        url: '',
    });

    const startEditing = (link: ItemContactLink) => {
        setEditingId(link.id);
        form.setData({
            name: link.name,
            school_group: link.school_group,
            school_level: link.school_level,
            url: link.url,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        form.reset();
        form.clearErrors();
    };

    const handleSort = (column: string) => {
        const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc';
        router.get('/admin/contact-links', { sort_by: column, sort_order: newOrder }, {
            preserveState: true,
            replace: true,
        });
    };

    const SortIcon = ({ column }: { column: string }) => {
        if (sortBy !== column) {
            return <RiSortDesc size={16} className="text-gray-300" />;
        }
        return sortOrder === 'asc'
            ? <RiSortAsc size={16} className="text-black" />
            : <RiSortDesc size={16} className="text-black" />;
    };

    const thClass = "p-3 text-left select-none cursor-pointer hover:bg-gray-200 transition-colors";

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full border-separate border-spacing-0">
                <thead className="bg-gray-100">
                    <tr>
                        <th className={thClass} onClick={() => handleSort('name')}>
                            <span className="flex justify-between items-center w-full">
                                Name<SortIcon column="name" />
                            </span>
                        </th>
                        <th className={thClass} onClick={() => handleSort('school_group')}>
                            <span className="flex justify-between items-center w-full">
                                Group<SortIcon column="school_group" />
                            </span>
                        </th>
                        <th className={thClass} onClick={() => handleSort('school_level')}>
                            <span className="flex justify-between items-center w-full">
                                Level<SortIcon column="school_level" />
                            </span>
                        </th>
                        <th className="p-3 text-left">URL</th>
                        <th className="p-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {links.map(link => (
                        <LinkRow
                            key={link.id}
                            link={link}
                            isEditing={editingId === link.id}
                            form={form}
                            onEdit={startEditing}
                            onCancel={cancelEditing}
                            schoolGroups={schoolGroups}
                            schoolLevels={schoolLevels}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
