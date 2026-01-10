import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";

interface ReviewStepProps {
  formData: KeepsakeFormValues;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  loading: boolean;
}

const ReviewStep = ({ formData, onBack, onSubmit, loading }: ReviewStepProps) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-serif text-keepla-gray-dark mb-2">
        Revisão
      </h2>
      <p className="text-keepla-gray-light mb-4">
        Verifique os dados antes de criar a cápsula
      </p>

      <div className="text-left max-w-xl mx-auto space-y-2">
        <div><strong>Tipo:</strong> {formData.type}</div>
        <div><strong>Destinatário:</strong> {formData.recipient_name}</div>
        <div><strong>Email:</strong> {formData.recipient_contact}</div>
        <div><strong>Título:</strong> {formData.title}</div>
        <div><strong>Mensagem:</strong> {formData.message}</div>
        <div><strong>Data de entrega:</strong> {formData.delivery_date}</div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 border rounded border-keepla-red text-keepla-red"
        >
          Anterior
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={loading}
          className="px-6 py-2 bg-keepla-red text-white rounded"
        >
          {loading ? 'A criar...' : 'Criar Cápsula'}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;