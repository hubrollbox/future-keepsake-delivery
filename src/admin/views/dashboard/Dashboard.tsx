import SummaryCards from "./SummaryCards";
import RecentActivities from "./RecentActivities";

const Dashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <SummaryCards />
      <RecentActivities />
    </div>
  );
};

export default Dashboard;
