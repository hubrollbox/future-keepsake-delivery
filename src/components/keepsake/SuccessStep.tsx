import { KeepsakeFormValues } from "@/validations/keepsakeValidationSchema";

interface SuccessStepProps {
  formData: KeepsakeFormValues;
}

const SuccessStep = ({ formData }: SuccessStepProps) => {
  return (
    <div className="text-center space-y-6">
      <h2 className="text-3xl font-bold text-keepla-red">
        Cápsula criada com sucesso!
      </h2>
      <p className="text-keepla-gray-light">
        A cápsula para {formData.recipient_name} será entregue na data selecionada.
      </p>
    </div>
  );
};

export default SuccessStep;