
import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2 } from "lucide-react";

const AdminDashboard = lazy(() => import("@/components/admin/AdminDashboard"));
const AdminDeliveries = lazy(() => import("@/components/admin/AdminDeliveries"));
const AdminWarehouse = lazy(() => import("@/components/admin/AdminWarehouse"));
const AdminMessages = lazy(() => import("@/components/admin/AdminMessages"));
const AdminPayments = lazy(() => import("@/components/admin/AdminPayments"));
const AdminClients = lazy(() => import("@/components/admin/AdminClients"));
const AdminProducts = lazy(() => import("@/components/admin/AdminProducts"));
const AdminPlans = lazy(() => import("@/components/admin/AdminPlans"));
const AdminContent = lazy(() => import("@/components/admin/AdminContent"));

const AdminDashboardPage = () => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
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
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="deliveries" element={<AdminDeliveries />} />
          <Route path="warehouse" element={<AdminWarehouse />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="clients" element={<AdminClients />} />
          <Route path="*" element={<Navigate to="." replace />} />
        </Routes>
      </Suspense>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
