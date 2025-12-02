import { Card, CardContent } from "@/components/ui/card";
import { Quote, Star } from "lucide-react";

const SUCCESS_STORIES = [
  {
    name: "Sarah Al-Mansour",
    role: "Founder, Elite Events",
    company: "Elite Events",
    quote: "AI LUXE gave me back 15 hours per week. The persona cloning is so accurate, clients can't tell the difference. My booking rate increased 40% while I focus on high-value relationships.",
    result: "+40% bookings, 15h/week saved",
    rating: 5,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
  },
  {
    name: "Mohammed Al-Rashid",
    role: "CEO, Gala Events",
    company: "Gala Events",
    quote: "The fair negotiator is brilliant. It handles 80% of price discussions automatically, only escalating when needed. We closed 3 major contracts last month while I was on vacation.",
    result: "80% automation, 3x ROI",
    rating: 5,
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
  },
  {
    name: "Layla Hassan",
    role: "Director, Luxury Weddings",
    company: "Luxury Weddings",
    quote: "Voice notes transcription changed everything. Clients send me 2-minute voice messages at midnight, and AI responds instantly in my tone. My response time went from 6 hours to 30 seconds.",
    result: "30s response time, 24/7 availability",
    rating: 5,
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
  },
  {
    name: "Khalid Al-Sabah",
    role: "Managing Partner, Fashion Forward",
    company: "Fashion Forward",
    quote: "Multi-platform support unified our WhatsApp, Instagram, and Telegram. One inbox, zero missed messages. We went from chaos to complete control in 48 hours.",
    result: "Zero missed messages, unified inbox",
    rating: 5,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
];

export default function ClientSuccessStories() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/20 to-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            Client <span className="text-luxury">Success Stories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from luxury event professionals who reclaimed their time
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {SUCCESS_STORIES.map((story, index) => (
            <Card 
              key={index}
              className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-luxury/50 bg-gradient-to-br from-background to-muted/5"
            >
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={story.image}
                    alt={story.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-luxury/20"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{story.name}</h3>
                    <p className="text-sm text-muted-foreground">{story.role}</p>
                    <p className="text-xs text-luxury font-semibold mt-1">{story.company}</p>
                  </div>
                  <Quote className="w-8 h-8 text-luxury/20" />
                </div>

                <div className="flex gap-1 mb-4">
                  {Array.from({ length: story.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-luxury text-luxury" />
                  ))}
                </div>

                <p className="text-base leading-relaxed mb-6 italic text-foreground/90">
                  "{story.quote}"
                </p>

                <div className="pt-4 border-t border-border/50">
                  <p className="text-sm font-semibold text-luxury">
                    {story.result}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
