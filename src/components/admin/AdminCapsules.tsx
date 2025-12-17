import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { fetchCapsules, Capsule } from "@/services/capsuleService";
import { Loader2 } from "lucide-react";

const AdminCapsules = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCapsules()
      .then(setCapsules)
      .catch(() => setCapsules([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-steel-blue font-fraunces">Arquivo das Cápsulas do Tempo</h1>
      
      <Card className="border-dusty-rose/20">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-8 text-misty-gray">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Carregando cápsulas...
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">ID</TableHead>
                    <TableHead className="text-gray-700">Tipo</TableHead>
                    <TableHead className="text-gray-700">Local Físico</TableHead>
                    <TableHead className="text-gray-700">Link Digital</TableHead>
                    <TableHead className="text-gray-700">Data Criação</TableHead>
                    <TableHead className="text-gray-700">Data Entrega</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Remetente</TableHead>
                    <TableHead className="text-gray-700">Contato</TableHead>
                    <TableHead className="text-gray-700">Destinatário</TableHead>
                    <TableHead className="text-gray-700">Contato</TableHead>
                    <TableHead className="text-gray-700">Notas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {capsules.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-misty-gray">
                        Nenhuma cápsula encontrada.
                      </TableCell>
                    </TableRow>
                  ) : (
                    capsules.map((capsule) => (
                      <TableRow key={capsule.id}>
                        <TableCell className="font-mono text-xs">{capsule.id.slice(0, 8)}...</TableCell>
                        <TableCell>{capsule.type}</TableCell>
                        <TableCell>{capsule.physical_location || '-'}</TableCell>
                        <TableCell>
                          {capsule.digital_link ? (
                            <a 
                              href={capsule.digital_link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-steel-blue hover:underline"
                            >
                              Link
                            </a>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{new Date(capsule.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(capsule.delivery_date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs ${
                            capsule.status === 'delivered' ? 'bg-sage-green/20 text-sage-green' :
                            capsule.status === 'scheduled' ? 'bg-golden-honey/20 text-golden-honey' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {capsule.status}
                          </span>
                        </TableCell>
                        <TableCell>{capsule.sender_name}</TableCell>
                        <TableCell>{capsule.sender_contact}</TableCell>
                        <TableCell>{capsule.recipient_name}</TableCell>
                        <TableCell>{capsule.recipient_contact}</TableCell>
                        <TableCell className="max-w-[200px] truncate" title={capsule.notes}>
                          {capsule.notes || '-'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCapsules;
