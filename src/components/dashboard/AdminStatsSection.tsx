
import { Card, CardContent } from "@/components/ui/card";

const AdminStatsSection = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-serif font-semibold text-muted-foreground-800 mb-4">Estatísticas Administrativas</h2>
      <Card className="shadow-soft border-border/20">
        <CardContent className="p-6">
          <p className="text-muted-foreground">Estatísticas simplificadas.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminStatsSection;
