
import { plans } from "@/lib/pricingData";

function Pricing() {
  return (
    <div>
      <h1>Planos de Preços</h1>
      <ul>
        {plans.map((plan, idx) => (
          <li key={idx}>
            <strong>{plan.name}</strong>: {plan.price} {plan.period} - {plan.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Pricing;
