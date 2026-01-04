
import { ReactNode, useState } from "react";
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
  ArrowLeft,
  ShoppingCart,
  Crown,
  FileText,
  Menu,
  X
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AdminLayoutProps {
  children: ReactNode;
  activeSection: string;
}

const AdminLayout = ({ children, activeSection }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut } = useAuth();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
    { id: "clients", label: "Clientes", icon: Users, path: "/admin/clients" },
    { id: "deliveries", label: "Entregas", icon: Package, path: "/admin/deliveries" },
    { id: "products", label: "Produtos", icon: ShoppingCart, path: "/admin/products" },
    { id: "plans", label: "Planos", icon: Crown, path: "/admin/plans" },
    { id: "content", label: "Conteúdo", icon: FileText, path: "/admin/content" },
    { id: "blog", label: "Blog", icon: FileText, path: "/admin/blog" },
    { id: "messages", label: "Mensagens", icon: MessageSquare, path: "/admin/messages" },
    { id: "payments", label: "Pagamentos", icon: CreditCard, path: "/admin/payments" },
    { id: "warehouse", label: "Armazém", icon: Warehouse, path: "/admin/warehouse" },
  ];

  return (
    <div className="min-h-screen bg-lavender-mist">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white/80 backdrop-blur-sm border-r border-dusty-rose/20 min-h-screen transition-all duration-300 relative`}>
          <div className="p-6 border-b border-dusty-rose/20">
            <div className="flex items-center justify-between">
              <div className={`flex items-center space-x-3 ${isCollapsed ? 'justify-center' : ''}`}>
                {/* Replace old icon with updated brand logo */}
                <img src="/keepla-logo-red.png" alt="keepla" className="w-8 h-8" />
                {!isCollapsed && (
                  <div>
                    <h2 className="font-fraunces font-semibold text-steel-blue">keepla</h2>
                    <p className="text-xs text-misty-gray">Administração</p>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="p-2 hover:bg-sand-beige/50"
              >
                {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
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
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'space-x-3 px-4'} py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? "bg-earthy-burgundy/10 text-earthy-burgundy border border-earthy-burgundy/20"
                      : "text-steel-blue hover:bg-sand-beige/50 hover:text-earthy-burgundy"
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <IconComponent className="h-5 w-5" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-steel-blue hover:text-earthy-burgundy hover:bg-sand-beige/50`}
              title={isCollapsed ? "Voltar ao Site" : undefined}
            >
              <ArrowLeft className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Voltar ao Site</span>}
            </Button>
            <Button
              variant="ghost"
              onClick={async () => {
                await signOut();
                navigate('/');
              }}
              className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} text-steel-blue hover:text-earthy-burgundy hover:bg-sand-beige/50`}
              title={isCollapsed ? "Sair" : undefined}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sair</span>}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-auto">
          <div className="max-w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
