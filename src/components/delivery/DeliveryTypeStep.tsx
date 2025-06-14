
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

type Props = {
  deliveryType: string;
  setDeliveryType: (type: string) => void;
  onNext: () => void;
};

const DeliveryTypeStep = ({ deliveryType, setDeliveryType, onNext }: Props) => (
  <>
    <div>
      <Label className="text-base font-semibold">Tipo de Presente</Label>
      <RadioGroup
        value={deliveryType}
        onValueChange={setDeliveryType}
        className="mt-2"
      >
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="digital" id="digital" />
          <Label htmlFor="digital" className="flex-1 cursor-pointer">
            <div>
              <p className="font-medium">Presente Digital</p>
              <p className="text-sm text-gray-600">Carta, vídeo, ou ficheiro digital</p>
            </div>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
          <RadioGroupItem value="physical" id="physical" />
          <Label htmlFor="physical" className="flex-1 cursor-pointer">
            <div>
              <p className="font-medium">Presente Físico</p>
              <p className="text-sm text-gray-600">Objeto que será guardado e entregue</p>
            </div>
          </Label>
        </div>
      </RadioGroup>
    </div>
    <div className="flex justify-end mt-6">
      <Button onClick={onNext}>Próximo</Button>
    </div>
  </>
);

export default DeliveryTypeStep;
