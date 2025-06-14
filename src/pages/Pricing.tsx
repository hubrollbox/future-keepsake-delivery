
import { plans } from "@/lib/pricingData";
import PlanCard from "@/components/PlanCard";

function Pricing() {
  return (
    <div className="min-h-screen bg-lavender-mist py-16 px-4 md:px-0">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-earthy-burgundy mb-4 font-fraunces">Escolhe o Plano Perfeito</h1>
        <p className="text-lg text-steel-blue">Descobre a melhor opção para guardar e entregar memórias no tempo certo.</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <PlanCard
            key={idx}
            name={plan.name}
            price={plan.price + (plan.period || "")}
            description={plan.description}
            features={plan.features}
            isPopular={plan.popular}
            isCurrentPlan={false}
            onSelect={() => {}}
          />
        ))}
      </div>
    </div>
  );
}

export default Pricing;
