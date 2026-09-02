import Navbar from "@/components/Navbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            <main className="flex flex-1 flex-col">{children}</main>
        </>
    );
}
