import { Check, Zap, Shield, Rocket } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Built on Next.js 13 with React Server Components for optimal performance and SEO.",
    icon: Zap,
  },
  {
    title: "Secure by Default",
    description:
      "Enterprise-grade security with built-in authentication and authorization.",
    icon: Shield,
  },
  {
    title: "Easy Deployment",
    description:
      "One-click deployment to your favorite hosting platform. No configuration needed.",
    icon: Rocket,
  },
  {
    title: "Best Practices",
    description:
      "Following industry standards and best practices for scalable applications.",
    icon: Check,
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Everything you need to build modern apps
          </h2>
          <p className="text-muted-foreground">
            Our platform provides all the tools and features you need to create
            successful SaaS applications.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-none shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;