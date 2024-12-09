import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: "$29",
    description: "Perfect for small teams and startups",
    features: [
      "Up to 5 team members",
      "Basic analytics",
      "24/7 email support",
      "1 project",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    description: "Best for growing businesses",
    features: [
      "Up to 20 team members",
      "Advanced analytics",
      "Priority support",
      "5 projects",
      "Custom integrations",
    ],
    popular: true,
  },
  // {
  //   name: "Enterprise",
  //   price: "$199",
  //   description: "For large organizations",
  //   features: [
  //     "Unlimited team members",
  //     "Enterprise analytics",
  //     "24/7 phone support",
  //     "Unlimited projects",
  //     "Custom integrations",
  //     "Dedicated account manager",
  //   ],
  // },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Harga Tunggal dan 
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Terjangkau
            </span> {" "}
            </h2>
          <p className="text-muted-foreground">
            Choose the perfect plan for your needs. No hidden fees.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative ${
                plan.popular
                  ? "border-blue-600 shadow-lg scale-105"
                  : "border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    enaiblr
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
              <button
      className={cn(
        "w-full rounded-lg px-4 py-2",
        plan?.popular 
          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90"
          : "border border-gray-200 bg-white text-gray-900 hover:bg-gray-100",
      )}>Get Started</button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;