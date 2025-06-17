import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FAQ() {
  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Perguntas Frequentes (FAQ)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <strong>Como agendo uma entrega?</strong>
            <p>Vá ao dashboard, clique em "Criar Entrega" e siga os passos do formulário.</p>
          </div>
          <div>
            <strong>Como sei que a entrega foi enviada?</strong>
            <p>Receberá uma notificação por email na data agendada. Pode acompanhar o estado no dashboard.</p>
          </div>
          <div>
            <strong>Posso editar ou cancelar uma entrega?</strong>
            <p>Sim, no dashboard pode editar ou cancelar entregas agendadas que ainda não foram enviadas.</p>
          </div>
          <div>
            <strong>Como funciona o pagamento?</strong>
            <p>Após criar a entrega, receberá um link para pagamento. Só após o pagamento a entrega será processada.</p>
          </div>
          <div>
            <strong>Preciso de ajuda!</strong>
            <p>Contacte-nos através da página de contacto ou envie email para suporte@futurekeepsake.com.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
