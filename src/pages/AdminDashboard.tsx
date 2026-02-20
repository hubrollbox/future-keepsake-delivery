
import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2 } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

const AdminDeliveries = lazy(() => import("@/components/admin/AdminDeliveries"));
const AdminWarehouse = lazy(() => import("@/components/admin/AdminWarehouse"));
const AdminMessages = lazy(() => import("@/components/admin/AdminMessages"));
const AdminPayments = lazy(() => import("@/components/admin/AdminPayments"));
const AdminClients = lazy(() => import("@/components/admin/AdminClients"));
const AdminProducts = lazy(() => import("@/components/admin/AdminProducts"));
const AdminPlans = lazy(() => import("@/components/admin/AdminPlans"));
const AdminContent = lazy(() => import("@/components/admin/AdminContent"));
const AdminBlog = lazy(() => import("@/components/admin/AdminBlog"));
const AdminEditorial = lazy(() => import("@/components/admin/AdminEditorial"));

const AdminDashboardPage = () => {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();
  const path = location.pathname.replace(/^\/admin\/?/, "");
  const activeSection = path === "" ? "dashboard" : path;

  if (loading) {
    return (
      <div className="min-h-screen bg-keepla-white flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-8 w-8 animate-spin text-keepla-red" />
          <span className="text-keepla-gray-dark font-medium">A verificar permissões...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-keepla-white flex items-center justify-center">
        <div className="text-center emotion-card p-8">
          <h1 className="text-2xl font-bold text-keepla-gray-dark mb-4 font-fraunces">Acesso Negado</h1>
          <p className="text-keepla-gray-light mb-4">Não tens permissões para aceder a esta área.</p>
          <a href="/" className="text-keepla-red hover:underline">Voltar ao início</a>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout activeSection={activeSection}>
      <Suspense fallback={<div>Carregando...</div>}>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="deliveries" element={<AdminDeliveries />} />
          <Route path="warehouse" element={<AdminWarehouse />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="blog" element={<AdminBlog />} />
          <Route path="editorial" element={<AdminEditorial />} />
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
