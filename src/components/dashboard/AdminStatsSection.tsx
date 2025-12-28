
import { Card, CardContent } from "@/components/ui/card";

const AdminStatsSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-semibold text-keepla-gray-800 mb-4">Estatísticas Administrativas</h2>
      <Card className="shadow-soft border-keepla-gray/20">
        <CardContent className="p-6">
          <p className="text-keepla-gray">Estatísticas simplificadas.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsSection;
