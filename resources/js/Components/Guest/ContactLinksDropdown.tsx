import { useState, useEffect, useRef } from "react";

interface ContactLinksRecord {
    id: number;
    name: string;
    school_group: string;
    url: string;
}

interface Props {
    label: string;
    links: ContactLinksRecord[];
}

export default function ContactLinksDropdown({ label, links }: Props) {
    const [open, setOpen] = useState(false);
    const [showContent, setShowContent] = useState(false);
    const openTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        return () => {
            if (openTimeoutRef.current) clearTimeout(openTimeoutRef.current);
        };
    }, []);

    const toggle = () => {
        if (open) {
            setShowContent(false);
            setOpen(false);
        } else {
            setOpen(true);
            openTimeoutRef.current = setTimeout(() => {
                setShowContent(true);
            }, 100);
        }
    };

    return (
        <div className="relative w-full max-w-sm md:max-w-md mx-auto mb-4">
            {/* Trigger button */}
            <button
                type="button"
                onClick={toggle}
                className="w-full bg-red-primary text-lg text-white font-raleway font-bold px-4 py-6 rounded-none flex justify-between items-center"
            >
                <span>{label}</span>

                {/* Triangle rotation */}
                <svg
                    className={`w-5 h-5 transition-transform duration-600 ${open ? "rotate-180" : "rotate-0"
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            <div
                className={`overflow-hidden border-2 border-red-primary transition-all ease-in-out ${open ? "max-h-96" : "max-h-0"
                    }`}
                style={{ transitionDuration: "400ms" }}
            >
                <div
                    className={`transition-opacity ${showContent ? "opacity-100" : "opacity-0"
                        }`}
                    style={{ transitionDuration: "400ms" }}
                >
                    {links.map((link) => (
                        <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? ''
                                fetch('/clicks', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-CSRF-TOKEN': csrfToken,
                                        'X-Requested-With': 'XMLHttpRequest'
                                    },
                                    body: JSON.stringify({ contact_link_id: link.id }),
                                    keepalive: true,
                                })
                            }}
                            className="block px-6 py-3 text-red-primary hover:bg-red-primary hover:text-white transition-colors"
                        >
                            {link.name}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
