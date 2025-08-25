import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCapsules, Capsule } from "@/services/capsuleService";

// interface Capsule {
//   id: string;
//   type: "Física" | "Digital";
//   physical_location?: string;
//   digital_link?: string;
//   created_at: string;
//   delivery_date: string;
//   status: string;
//   sender_name: string;
//   sender_contact: string;
//   recipient_name: string;
//   recipient_contact: string;
//   notes?: string;
// }

const AdminCapsules = () => {
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [loading, setLoading] = useState(true);
  // ... filtros, busca, etc.

  useEffect(() => {
    fetchCapsules()
      .then(setCapsules)
      .catch(() => setCapsules([]))
      .finally(() => setLoading(false));
  }, [fetchCapsules]);

  // Remove fetchCapsules definition from here
  // ... renderização da tabela, filtros, ações, etc.

  return (
    <Card>
      <CardHeader>
        <CardTitle>Arquivo das Cápsulas do Tempo</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Local Físico</th>
                  <th>Link Digital</th>
                  <th>Data Criação</th>
                  <th>Data Entrega</th>
                  <th>Status</th>
                  <th>Remetente</th>
                  <th>Contato Remetente</th>
                  <th>Destinatário</th>
                  <th>Contato Destinatário</th>
                  <th>Notas</th>
                </tr>
              </thead>
              <tbody>
                {capsules.map((capsule) => (
                  <tr key={capsule.id}>
                    <td>{capsule.id}</td>
                    <td>{capsule.type}</td>
                    <td>{capsule.physical_location || '-'}</td>
                    <td>{capsule.digital_link ? <a href={capsule.digital_link} target="_blank" rel="noopener noreferrer">Link</a> : '-'}</td>
                    <td>{new Date(capsule.created_at).toLocaleDateString()}</td>
                    <td>{new Date(capsule.delivery_date).toLocaleDateString()}</td>
                    <td>{capsule.status}</td>
                    <td>{capsule.sender_name}</td>
                    <td>{capsule.sender_contact}</td>
                    <td>{capsule.recipient_name}</td>
                    <td>{capsule.recipient_contact}</td>
                    <td>{capsule.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminCapsules;