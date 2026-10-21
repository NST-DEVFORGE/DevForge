import type { Metadata } from "next";
import { studentsData } from "@/data/students";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const student = studentsData.find((profile) => profile.slug === slug);

    if (!student) return {};

    return {
        title: { absolute: `${student.name} | DevForge` },
        description: `${student.name} is a ${student.role} at DevForge.`,
        alternates: { canonical: `/students/${slug}` },
        openGraph: {
            images: [{ url: student.photo, alt: student.name }],
        },
    };
}

export default function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return children;
}