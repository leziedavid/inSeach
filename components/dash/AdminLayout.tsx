import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-50 min-h-screen">
        <Header />
        {children}
      </div>
    </div>
  );
}
