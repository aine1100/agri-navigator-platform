
import { Leaf, BarChart3, CloudSun, Smartphone, ArrowRight, Instagram, Twitter, Facebook, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeatureCard from "@/components/FeatureCard";
import TestimonialCard from "@/components/TestimonialCard";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm fixed w-full z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="h-6 w-6 text-farm-forest" />
            <span className="font-bold text-xl text-farm-forest">AgriNavigator</span>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-sm font-medium hover:text-farm-forest">Features</a>
            <a href="#testimonials" className="text-sm font-medium hover:text-farm-forest">Testimonials</a>
            <a href="#contact" className="text-sm font-medium hover:text-farm-forest">Contact</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="bg-farm-forest text-white hover:bg-farm-forest/90">Sign up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-cover bg-center" style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80)',
        backgroundPosition: 'center',
        backgroundSize: 'cover'
      }}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl text-center mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight animate-fade-in">
              Effortless Farm Management for Smart Farmers
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Streamline your agricultural operations, track crop growth, manage livestock, and boost your farm's productivity with AgriNavigator.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Link to="/signup">
                <Button size="lg" className="bg-farm-green text-white hover:bg-farm-green/90 w-full sm:w-auto">
                  Get Started <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="bg-white/10 text-white border-white/20 hover:bg-white/20 w-full sm:w-auto">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Smart Farm Management Solutions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to manage your farm efficiently in one place.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              title="Crop Tracking" 
              description="Monitor planting cycles, track growth, and schedule harvests with precision and ease."
              icon={Leaf}
            />
            <FeatureCard 
              title="Livestock Management" 
              description="Keep records of your animals, track health conditions, and manage breeding schedules."
              icon={Smartphone}
            />
            <FeatureCard 
              title="Weather Forecasts" 
              description="Get accurate, localized weather predictions to help you plan your farm activities."
              icon={CloudSun}
            />
            <FeatureCard 
              title="Financial Reports" 
              description="Track revenue, expenses, and profits with easy-to-understand financial analytics."
              icon={BarChart3}
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">What Farmers Say About Us</h2>
            <p className="text-lg text-muted-foreground">Join thousands of farmers who have transformed their agricultural operations.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="AgriNavigator has revolutionized how I manage my farm. The crop tracking feature alone has increased my yield by 20% this season."
              name="John Peterson"
              role="Wheat Farmer, Iowa"
            />
            <TestimonialCard 
              quote="As a livestock farmer, the health tracking has been invaluable. I can spot issues earlier and intervene quicker than ever before."
              name="Sarah Johnson"
              role="Cattle Rancher, Texas"
            />
            <TestimonialCard 
              quote="The financial reports give me insights I never had before. I finally feel in control of my farm's finances and future planning."
              name="Michael Rodriguez"
              role="Organic Fruit Farmer, California"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-farm-forest text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Farm Management?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of satisfied farmers using AgriNavigator to grow their agricultural business.</p>
          <Link to="/signup">
            <Button size="lg" className="bg-white text-farm-forest hover:bg-white/90">
              Start Your Free Trial <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Leaf className="h-6 w-6 text-farm-green" />
                <span className="font-bold text-xl">AgriNavigator</span>
              </div>
              <p className="text-sm text-gray-400">Empowering farmers with smart technology since 2020.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Features</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Crop Tracking</a></li>
                <li><a href="#" className="hover:text-white">Livestock Management</a></li>
                <li><a href="#" className="hover:text-white">Weather Forecasts</a></li>
                <li><a href="#" className="hover:text-white">Financial Reports</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Contact Us</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a href="mailto:info@agrinavigator.com" className="hover:text-white">info@agrinavigator.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <a href="tel:+1-800-123-4567" className="hover:text-white">+1-800-123-4567</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2023 AgriNavigator. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
