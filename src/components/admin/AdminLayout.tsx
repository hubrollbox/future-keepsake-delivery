
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Clock, BarChart3, Package, MessageSquare, Warehouse, CreditCard, Users } from "lucide-react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: BarChart3 },
    { path: "/admin/deliveries", label: "Entregas", icon: Package },
    { path: "/admin/warehouse", label: "Armazém", icon: Warehouse },
    { path: "/admin/messages", label: "Mensagens", icon: MessageSquare },
    { path: "/admin/payments", label: "Pagamentos", icon: CreditCard },
    { path: "/admin/clients", label: "Clientes", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-gold" />
              <span className="text-xl font-bold text-black">FuturoPresente</span>
            </Link>
            <div className="text-sm text-gray-600 font-medium">
              Painel de Administração
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <nav className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Navegação</h3>
              <ul className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-gold/10 text-gold"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main className="lg:col-span-4">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
