import Header from "@/components/Header";
import AppSidebar from "@/components/AppSidebar";
import { ClerkLoaded } from "@clerk/nextjs";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkLoaded>
      <div className="flex h-screen bg-[#fafafa] overflow-hidden">
        {/* Left Navigation Sidebar */}
        <AppSidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </ClerkLoaded>
  );
}
export default DashboardLayout;

