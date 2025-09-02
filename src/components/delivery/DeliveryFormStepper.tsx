
import DeliveryTypeStep from "./DeliveryTypeStep";
import DeliveryDetailsStep from "./DeliveryDetailsStep";
import DeliveryMessageStep from "./DeliveryMessageStep";
import DeliveryReviewStep from "./DeliveryReviewStep";
import DeliveryConfirmationStep from "./DeliveryConfirmationStep";

export interface DeliveryFormData {
  recipient: string;
  recipient_email?: string;
  deliveryDate: string;
  deliveryTime?: string;
  delivery_method?: string;
  location?: string;
  description: string;
  message: string;
  digitalFile?: File;
  title: string;
}

type Props = {
  step: number;
  deliveryType: string;
  setDeliveryType: (type: string) => void;
  formData: DeliveryFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nextStep: () => void;
  prevStep: () => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  error: string;
};

const DeliveryFormStepper = ({
  step,
  deliveryType,
  setDeliveryType,
  formData,
  handleInputChange,
  handleFileChange,
  nextStep,
  prevStep,
  onSubmit,
  loading,
  error
}: Props) => {
  switch (step) {
    case 0:
      return <DeliveryTypeStep deliveryType={deliveryType} setDeliveryType={setDeliveryType} onNext={nextStep} />;
    case 1:
      return <DeliveryDetailsStep formData={formData} handleInputChange={handleInputChange} deliveryType={deliveryType} prevStep={prevStep} nextStep={nextStep} />;
    case 2:
      return <DeliveryMessageStep formData={formData} handleInputChange={handleInputChange} handleFileChange={handleFileChange} deliveryType={deliveryType} prevStep={prevStep} nextStep={nextStep} />;
    case 3:
      return <DeliveryReviewStep formData={formData} deliveryType={deliveryType} prevStep={prevStep} onSubmit={onSubmit} loading={loading} error={error} />;
    case 4:
      return <DeliveryConfirmationStep recipient={formData.recipient} deliveryDate={formData.deliveryDate} />;
    default:
      return null;
  }
};

export default DeliveryFormStepper;
