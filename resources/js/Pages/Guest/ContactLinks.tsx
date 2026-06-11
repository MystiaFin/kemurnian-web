import { Head } from "@inertiajs/react";
import GuestLayout from "@/Layouts/GuestLayout";
import SectionHeader from "@GuestComponents/SectionHeader";
import ContactGroupDropdown from "@GuestComponents/ContactLinksDropdown";

interface ContactLinksRecord {
  id: number;
  name: string;
  school_group: string;
  url: string;
}

interface SchoolGroupOption {
  value: string;
  label: string;
}

interface Props {
  contactLinks: ContactLinksRecord[];
  schoolGroups: SchoolGroupOption[];
}

// Helper: group links by school_group
function groupLinks(links: ContactLinksRecord[]): Record<string, ContactLinksRecord[]> {
  return links.reduce<Record<string, ContactLinksRecord[]>>((acc, link) => {
    const key = link.school_group;
    if (!acc[key]) acc[key] = [];
    acc[key].push(link);
    return acc;
  }, {});
}

// Helper: build label lookup from schoolGroups
function buildLabelMap(groups: SchoolGroupOption[]): Record<string, string> {
  return Object.fromEntries(groups.map((g) => [g.value, g.label]));
}

export default function ContactLinks({ contactLinks, schoolGroups }: Props) {
  const hasLinks = contactLinks && contactLinks.length > 0;

  // Prepare data only if there are links
  const groupedLinks = hasLinks ? groupLinks(contactLinks) : {};
  const labels = buildLabelMap(schoolGroups);

  return (
    <>
      <Head title="Contact Links | Sekolah Kemurnian" />
      <h1 className="flex items-center justify-center mb-8 w-full h-40 md:h-86 bg-red-primary text-white text-4xl md:text-6xl font-raleway font-bold text-center uppercase">
        Contact Us!
      </h1>
      <section className="py-12">
        <SectionHeader title="KONTAK ADMIN KEMURNIAN" as="h2" />

        {hasLinks &&
          Object.entries(groupedLinks).map(([groupKey, links]) => (
            <ContactGroupDropdown
              key={groupKey}
              label={labels[groupKey] ?? groupKey}
              links={links}
            />
          ))}
      </section>
    </>
  );
}

ContactLinks.layout = (page: React.ReactNode) => <GuestLayout>{page}</GuestLayout>;
