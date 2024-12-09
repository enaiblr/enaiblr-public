import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your
            {" "}
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            development workflow?
            </span> {" "}
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of developers who are already building faster with our
            platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-90">
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline">
              Contact Admin
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;