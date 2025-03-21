
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Cloud, Tractor, ShoppingBag, HomeIcon } from "lucide-react";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="container mx-auto px-4 py-6 md:py-8 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-farm-forest" />
          <span className="text-xl font-bold">Hinga</span>
        </Link>
        <div className="flex items-center space-x-4">
        <Link to="/">
            <Button variant="ghost" size="sm">
              <HomeIcon className="h-4 w-4 mr-2" />
             Home
            </Button>
          </Link>
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
              name="John D."
              role="Crop Farmer"
            />
            <TestimonialCard 
              quote="The marketplace feature has opened up new revenue streams for our family farm. We're now selling directly to consumers at better prices."
              name="Sarah M."
              role="Dairy Farmer"
            />
            <TestimonialCard 
              quote="I love how everything is integrated in one platform. The weather forecasts have been incredibly accurate and helpful."
              name="Michael R."
              role="Mixed Farm Owner"
            />
          </div>
        </section>

        {/* CTA section */}
        <section className="container mx-auto px-4 py-12 md:py-24 bg-farm-forest/10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Farm?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of farmers who have already upgraded their farm management with Hinga.
            </p>
            <Link to="/signup">
              <Button size="lg" className="bg-farm-forest hover:bg-farm-forest/90">
                Start Your Free Trial
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-6 w-6 mr-2 text-farm-forest" />
                <span className="font-bold text-xl">Hinga </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Connecting farmers directly to consumers for fresher, more sustainable food.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-sm text-muted-foreground hover:text-farm-forest">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/marketplace" className="text-sm text-muted-foreground hover:text-farm-forest">
                    Marketplace
                  </Link>
                </li>
                <li>
                  <Link to="/farmer" className="text-sm text-muted-foreground hover:text-farm-forest">
                    Become a Farmer
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-sm text-muted-foreground hover:text-farm-forest">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contact Us</h3>
              <address className="not-italic text-sm text-muted-foreground space-y-2">
                <p>123 Farm Road, Countryside</p>
                <p>Email: info@Hinga.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Hinga . All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
