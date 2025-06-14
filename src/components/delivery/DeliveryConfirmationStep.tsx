
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type Props = {
  recipient: string;
  deliveryDate: string;
};

const DeliveryConfirmationStep = ({ recipient, deliveryDate }: Props) => {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-green-600 mb-4">Entrega Criada com Sucesso!</h2>
      <p className="text-lg">Obrigado por usar o Future Keepsake Delivery.</p>
      <p className="text-md mt-2">A sua entrega para <strong>{recipient}</strong> foi agendada para <strong>{deliveryDate}</strong>.</p>
      <Button onClick={() => navigate("/dashboard")} className="mt-6">Voltar ao Dashboard</Button>
    </div>
  );
};

export default DeliveryConfirmationStep;
