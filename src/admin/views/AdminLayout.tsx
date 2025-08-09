import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <aside className="sidebar">Sidebar</aside>
      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
