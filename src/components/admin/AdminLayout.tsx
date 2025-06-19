
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Package, 
  MessageSquare, 
  CreditCard, 
  Warehouse, 
  LayoutDashboard,
  LogOut,
  ArrowLeft
} from "lucide-react";
import SeloDoTempoIcon from "@/components/SeloDoTempoIcon";

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
}

const AdminLayout = ({ children, activeSection }: AdminLayoutProps) => {
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { id: "clients", label: "Clientes", icon: Users, path: "/admin/clients" },
    { id: "deliveries", label: "Entregas", icon: Package, path: "/admin/deliveries" },
    { id: "messages", label: "Mensagens", icon: MessageSquare, path: "/admin/messages" },
    { id: "payments", label: "Pagamentos", icon: CreditCard, path: "/admin/payments" },
    { id: "warehouse", label: "Armazém", icon: Warehouse, path: "/admin/warehouse" },
  ];

  return (
    <div className="min-h-screen bg-lavender-mist">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-dusty-rose/20 min-h-screen">
          <div className="p-6 border-b border-dusty-rose/20">
            <div className="flex items-center space-x-3">
              <SeloDoTempoIcon className="w-8 h-8" />
              <div>
                <h2 className="font-fraunces font-semibold text-steel-blue">keeplar</h2>
                <p className="text-xs text-misty-gray">Administração</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-earthy-burgundy/10 text-earthy-burgundy border border-earthy-burgundy/20"
                      : "text-steel-blue hover:bg-sand-beige/50 hover:text-earthy-burgundy"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="w-full justify-start text-steel-blue hover:text-earthy-burgundy hover:bg-sand-beige/50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Site
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-steel-blue hover:text-earthy-burgundy hover:bg-sand-beige/50"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
