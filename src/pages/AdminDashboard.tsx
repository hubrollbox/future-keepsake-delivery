
import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminDeliveries from "@/components/admin/AdminDeliveries";
import AdminWarehouse from "@/components/admin/AdminWarehouse";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminPayments from "@/components/admin/AdminPayments";
import AdminClients from "@/components/admin/AdminClients";
import { Loader2 } from "lucide-react";

const AdminDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-dusty-rose" />
          <span className="text-steel-blue font-medium">A verificar permissões...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-lavender-mist flex items-center justify-center">
        <div className="text-center emotion-card p-8">
          <h1 className="text-2xl font-bold text-steel-blue mb-4 font-fraunces">Acesso Negado</h1>
          <p className="text-misty-gray mb-4">Não tens permissões para aceder a esta área.</p>
          <a href="/" className="text-dusty-rose hover:underline">Voltar ao início</a>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeSection="dashboard">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/deliveries" element={<AdminDeliveries />} />
        <Route path="/warehouse" element={<AdminWarehouse />} />
        <Route path="/messages" element={<AdminMessages />} />
        <Route path="/payments" element={<AdminPayments />} />
        <Route path="/clients" element={<AdminClients />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
