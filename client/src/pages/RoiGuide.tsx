import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, FileText, Video, Linkedin, Package } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { Link } from "wouter";

export default function RoiGuide() {
  const resources = [
    {
      title: "Complete ROI Guide (PDF)",
      description: "32-page comprehensive analysis with case studies, benchmarks, and calculations",
      icon: FileText,
      file: "/docs/roi-guide-complete.pdf",
      size: "2.1 MB",
      type: "PDF Document"
    },
    {
      title: "Loom Script & Storyboard",
      description: "2-minute video guide script with timing, visuals, and ROI breakdown",
      icon: Video,
      file: "/docs/loom-script-roi.md",
      size: "45 KB",
      type: "Markdown"
    },
    {
      title: "LinkedIn 30s Elevator Pitch",
      description: "Ready-to-record script with A/B testing plan and engagement tactics",
      icon: Linkedin,
      file: "/docs/linkedin-elevator-pitch-30s.md",
      size: "28 KB",
      type: "Markdown"
    },
    {
      title: "Agency Export Package",
      description: "Complete white-label setup guide with all sales assets, navigation guide, and client onboarding templates",
      icon: Package,
      file: "/docs/agency-export-package.zip",
      size: "385 KB",
      type: "ZIP Archive"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  AI <span className="text-primary">LUXE</span>
                </h1>
                <p className="text-xs text-neutral-600">Time is the Real Luxury</p>
              </div>
            </a>
          </Link>
          <Link href="/pricing">
            <Button variant="default">View Pricing</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Luxury Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-yellow-50 opacity-60"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black px-8 py-4 rounded-full font-bold text-2xl mb-8 shadow-2xl shadow-yellow-500/50 animate-pulse">
            <span className="text-5xl">✨ 32x</span>
            <span className="text-xl">Return on Investment</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-neutral-900 mb-8 leading-tight">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400">Golden</span> ROI Guide
          </h1>
          <p className="text-2xl text-neutral-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Everything you need to understand, present, and sell the AI LUXE value proposition. 
            <strong className="text-neutral-900">All resources are free to download and use.</strong>
          </p>
          
          <div className="flex flex-wrap gap-6 justify-center text-lg">
            <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-primary">$9,500</div>
              <div className="text-neutral-600">Monthly Benefit</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-primary">$299</div>
              <div className="text-neutral-600">Monthly Cost</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg">
              <div className="text-3xl font-bold text-primary">2 Days</div>
              <div className="text-neutral-600">Payback Period</div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Summary Cards */}
      <section className="py-12 px-4 bg-neutral-100">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-3xl">$9,500</CardTitle>
                <CardDescription>Monthly Benefit</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600">
                <ul className="space-y-1">
                  <li>• $6,000 labor savings</li>
                  <li>• $1,500 revenue recovery</li>
                  <li>• $2,000 predictive gains</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-3xl">$299</CardTitle>
                <CardDescription>Monthly Cost</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600">
                <ul className="space-y-1">
                  <li>• No setup fees</li>
                  <li>• No hidden costs</li>
                  <li>• Cancel anytime</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary text-3xl">2 Days</CardTitle>
                <CardDescription>Payback Period</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-neutral-600">
                <ul className="space-y-1">
                  <li>• Setup in 10 minutes</li>
                  <li>• First booking in 24-48h</li>
                  <li>• Break-even after first recovery</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-neutral-50">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-5xl font-bold text-neutral-900 mb-6 text-center">
            📥 Download Sales Assets
          </h2>
          <p className="text-xl text-neutral-600 mb-16 text-center max-w-3xl mx-auto">
            Huge, beautiful, instant downloads. Everything you need to sell AI LUXE.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            {resources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden border-2">
                  {/* Huge Thumbnail */}
                  <div className="h-64 bg-gradient-to-br from-primary/20 to-yellow-400/20 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-primary/10 group-hover:scale-110 transition-transform duration-500"></div>
                    <Icon className="w-32 h-32 text-primary/40 relative z-10 group-hover:scale-110 transition-transform" />
                    {resource.file && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        ✓ Ready
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl mb-3 group-hover:text-primary transition-colors">{resource.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{resource.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm text-neutral-600">
                        <p className="font-semibold text-base">{resource.type}</p>
                        <p className="text-neutral-500">{resource.size}</p>
                      </div>
                    </div>
                    {resource.file ? (
                      <a href={resource.file} download className="block">
                        <Button variant="default" size="lg" className="w-full text-lg font-semibold group-hover:shadow-xl transition-shadow">
                          <Download className="w-5 h-5 mr-2" />
                          Instant Download
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" size="lg" className="w-full text-lg" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to See 32x ROI?</h2>
          <p className="text-xl text-neutral-300 mb-8">
            Start your free 14-day trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button size="lg" variant="default" className="min-w-[200px]">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" variant="outline" className="min-w-[200px] bg-transparent text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-neutral-100 text-center text-sm text-neutral-600">
        <p>© 2025 AI LUXE · <a href="https://ailuxe.co" className="hover:text-primary">ailuxe.co</a></p>
        <p className="mt-2">Time is the Real Luxury</p>
      </footer>
    </div>
  );
}
