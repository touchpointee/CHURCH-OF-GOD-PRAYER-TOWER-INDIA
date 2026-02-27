import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import InaugurationOverlay from "@/inauguration/InaugurationOverlay";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <InaugurationOverlay />
            <Header />
            <main className="min-h-screen pt-24">
                {children}
            </main>
            <Footer />
            <WhatsAppFloat />
        </>
    );
}
