"use client"
import JoinForm from "@/components/join-form"
import ProfessionalImageGallery from "@/components/professional-gallery"
import FeatureShowcase from "@/components/feature-showcase"
import BusinessShowcase from "@/components/business-showcase"
import MediaGallery from "@/components/media-gallery"
import { Link, Sparkles, Users, Globe, Zap, Shield, Wifi, Camera, Monitor, Smartphone, Headphones } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      {/* Hero Section - Professional Theme */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Professional Bridge App */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="relative w-32 h-32 mx-auto lg:mx-0 mb-6">
              {/* Professional Bridge logo with real image */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 rounded-full animate-pulse opacity-75"></div>
              <div className="relative w-32 h-32 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 rounded-full flex items-center justify-center shadow-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=128&h=128&fit=crop&crop=center"
                  alt="Bridge Communication Logo"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/30"
                />
                <Link className="absolute inset-0 w-full h-full text-white/20" />
                {/* Professional connection indicators */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-blue-400 animate-bounce" />
              <Globe className="absolute -bottom-2 -right-2 w-6 h-6 text-indigo-400 animate-pulse" />
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Bridge
              </span>
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
              Next-Gen Communication Platform
            </h2>
            
            <p className="text-lg mb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              Connect teams, share ideas, and collaborate seamlessly across the globe.
              <br />
              <span className="italic text-blue-600 font-medium">
                "Building bridges between minds and innovations"
              </span>
            </p>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-6">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                🌉 Enterprise-grade security • Real-time sync • Global infrastructure
              </span>
            </div>

            <JoinForm />
          </div>

          {/* Right Side - Professional Image Gallery */}
          <div className="space-y-6">
            <ProfessionalImageGallery />
            
            {/* Professional stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
              </div>
              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-indigo-600">150+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Countries</div>
              </div>
              <div className="p-4 bg-white/80 dark:bg-gray-800/80 rounded-lg shadow-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-purple-600">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Showcase Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience cutting-edge communication technology designed for modern professionals. 
              Everything you need to stay connected and productive.
            </p>
          </div>
          
          <FeatureShowcase />
        </div>

        {/* Business Showcase Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Bridge in Enterprise
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See how leading companies are transforming their communication workflows with Bridge.
            </p>
          </div>
          
          <BusinessShowcase />
        </div>

        {/* Media Gallery Section */}
        <div className="mt-16 space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-gray-200">
              Rich Media Experience
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Share more than words - experience 4K video, crystal-clear audio, and seamless file collaboration.
            </p>
          </div>
          
          <MediaGallery />
        </div>

        {/* Image Grid Section */}
        <div className="mt-16 space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
            See Bridge in Action
          </h2>
          
          {/* Large Image Grid with improved loading */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&auto=format&q=75" 
              alt="Modern workspace"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Workspace'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Team collaboration"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Collaboration'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Digital innovation"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Innovation'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Global network"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/06B6D4/FFFFFF?text=Global+Network'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Communication tech"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/10B981/FFFFFF?text=Communication'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Video conference"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=Video+Conference'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Business meeting"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/EF4444/FFFFFF?text=Business+Meeting'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop&auto=format&q=75"
              alt="Global reach"
              className="w-full h-32 object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=Global+Reach'
              }}
            />
          </div>
        </div>

        {/* Technology & Features Grid */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Technology Stack */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              Advanced Technology
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg text-center">
                <Wifi className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Real-time Sync</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Instant message delivery</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-lg text-center">
                <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">End-to-End Security</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Military-grade encryption</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-lg text-center">
                <Camera className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">HD Media</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">4K video & audio</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20 rounded-lg shadow-lg text-center">
                <Zap className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200">Lightning Fast</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sub-second latency</p>
              </div>
            </div>
          </div>

          {/* Device Compatibility */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200">
              Universal Compatibility
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900/20 dark:to-blue-900/20 rounded-lg shadow-lg text-center">
                <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Desktop</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Windows, Mac, Linux</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-lg text-center">
                <Smartphone className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Mobile</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">iOS, Android</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg shadow-lg text-center">
                <Headphones className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Audio</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">Noise cancelling</p>
              </div>
            </div>
            
            {/* Device Images */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <img 
                src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=300&fit=crop&auto=format&q=75"
                alt="Desktop setup"
                className="w-full h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=Desktop+Setup'
                }}
              />
              <img 
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop&auto=format&q=75"
                alt="Mobile devices"
                className="w-full h-20 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/400x300/6366F1/FFFFFF?text=Mobile+Devices'
                }}
              />
            </div>
          </div>
        </div>

        {/* Testimonials & Success Stories */}
        <div className="mt-16 space-y-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
            What Our Users Say
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                quote: "Bridge transformed how our global team collaborates", 
                company: "Tech Innovators Inc.",
                image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&face=center",
                role: "CTO, Sarah Johnson"
              },
              { 
                quote: "Seamless communication across 50+ locations", 
                company: "Global Enterprises",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&face=center",
                role: "Director, Michael Chen"
              },
              { 
                quote: "The most reliable platform we've ever used", 
                company: "Remote Solutions Ltd.",
                image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&face=center",
                role: "CEO, Emily Rodriguez"
              },
              { 
                quote: "Incredible performance and ease of use", 
                company: "Digital Dynamics",
                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&face=center",
                role: "Lead Developer, David Kim"
              },
              { 
                quote: "Bridge keeps our distributed team connected", 
                company: "Future Works Corp",
                image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&face=center",
                role: "VP Operations, Lisa Wang"
              },
              { 
                quote: "Exceptional security and reliability", 
                company: "SecureConnect",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&face=center",
                role: "Security Lead, James Wilson"
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image}
                    alt={testimonial.role}
                    className="w-12 h-12 rounded-full object-cover mr-4 shadow-md"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm">
                      {testimonial.role}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
                <p className="italic text-gray-700 dark:text-gray-300">
                  "{testimonial.quote}"
                </p>
                <div className="flex text-yellow-400 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action with More Images */}
        <div className="mt-16 text-center space-y-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
            Ready to Transform Your Communication?
          </h2>
          
          {/* Technology Partners Section */}
          <div className="mt-8 mb-8">
            <h3 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-300 mb-6">
              Trusted by Leading Technology Partners
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
              {/* Technology Company Logos */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">TECH</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">CLOUD</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">DATA</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">MOBILE</span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">SECURE</span>
              </div>
            </div>
          </div>

          {/* Industry showcase images with improved loading */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=300&h=200&fit=crop&auto=format&q=75" 
              alt="Healthcare teams"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Healthcare'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=300&h=200&fit=crop&auto=format&q=75"
              alt="Financial services"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200/3B82F6/FFFFFF?text=Finance'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop&auto=format&q=75"
              alt="Education sector"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Education'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1515378791036-0648a814c963?w=300&h=200&fit=crop&auto=format&q=75"
              alt="Technology companies"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200/6366F1/FFFFFF?text=Technology'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop&auto=format&q=75"
              alt="Manufacturing"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Manufacturing'
              }}
            />
            <img 
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&h=150&fit=crop"
              alt="Government"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=150&fit=crop"
              alt="Retail chains"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
            <img 
              src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=200&h=150&fit=crop"
              alt="Logistics"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&h=150&fit=crop"
              alt="Media companies"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
            <img 
              src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=200&h=150&fit=crop"
              alt="Consulting firms"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&h=150&fit=crop"
              alt="Non-profits"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
            <img 
              src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=150&fit=crop"
              alt="Startups"
              className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            />
          </div>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Join thousands of organizations across every industry who trust Bridge for their critical communications.
            <br />
            <span className="font-semibold text-blue-600">Start your journey today.</span>
          </p>
        </div>
      </div>
    </main>
  )
}
