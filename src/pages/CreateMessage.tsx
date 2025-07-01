import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CreateMessage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h1>Criar Mensagem</h1>
      <p>Em breve: formulário para criar uma nova mensagem.</p>
      <Button variant="outline" onClick={() => navigate(-1)} style={{ marginTop: 16 }}>
        Voltar
      </Button>
    </div>
  );
};

export default CreateMessage;