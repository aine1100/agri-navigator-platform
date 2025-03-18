
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Cloud, Tractor, ShoppingBag } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 md:py-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-farm-forest" />
          <span className="text-xl font-bold">FarmFlow</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/marketplace">
            <Button variant="ghost" size="sm">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Marketplace
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="ghost" size="sm">Login</Button>
          </Link>
          <Link to="/signup">
            <Button variant="default" size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Streamline Your Farm Management
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              The comprehensive solution for modern farmers. Manage crops, livestock, weather data, and finances all in one place.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <Button size="lg" className="bg-farm-forest hover:bg-farm-forest/90 w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Shop Farm Products
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section className="container mx-auto px-4 py-12 md:py-24 bg-muted/50">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Leaf}
              title="Crop & Livestock Management"
              description="Track planting schedules, monitor growth stages, and manage your livestock with comprehensive health records and feeding plans."
            />
            <FeatureCard 
              icon={Cloud}
              title="Weather Insights"
              description="Get real-time weather data and forecasts specific to your farm location to make informed decisions about your operations."
            />
            <FeatureCard 
              icon={ShoppingBag}
              title="Marketplace"
              description="Sell your farm products directly to customers through our integrated marketplace, eliminating middlemen and increasing your profits."
            />
          </div>
        </section>

        {/* Testimonials section */}
        <section className="container mx-auto px-4 py-12 md:py-24">
          <h2 className="text-3xl font-bold text-center mb-12">What Farmers Say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="FarmFlow has revolutionized how I manage my farm. I've saved countless hours on paperwork and planning."
              author="John D."
              role="Crop Farmer"
            />
            <TestimonialCard 
              quote="The marketplace feature has opened up new revenue streams for our family farm. We're now selling directly to consumers at better prices."
              author="Sarah M."
              role="Dairy Farmer"
            />
            <TestimonialCard 
              quote="I love how everything is integrated in one platform. The weather forecasts have been incredibly accurate and helpful."
              author="Michael R."
              role="Mixed Farm Owner"
            />
          </div>
        </section>

        {/* CTA section */}
        <section className="container mx-auto px-4 py-12 md:py-24 bg-farm-forest/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farm?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of farmers who have already upgraded their farm management with FarmFlow.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-farm-forest hover:bg-farm-forest/90">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Tractor className="h-5 w-5 text-farm-forest" />
              <span className="font-semibold">FarmFlow</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2023 FarmFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
