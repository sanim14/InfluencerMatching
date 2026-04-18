import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ArrowRight, Target } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const [product, setProduct] = useState("");
  const [audience, setAudience] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!product.trim() || !audience.trim()) return;
    
    const params = new URLSearchParams();
    params.set("product", product);
    params.set("audience", audience);
    
    setLocation(`/results?${params.toString()}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 sm:px-6">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/5 rounded-xl mb-4">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Reach</h1>
          <p className="text-muted-foreground text-lg">
            Discover the perfect creators for your campaign.
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Campaign Details</CardTitle>
            <CardDescription>
              Describe your product and target audience to find matching influencers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="product">Product Description</Label>
                <Textarea
                  id="product"
                  placeholder="e.g. A high-performance mechanical keyboard designed for developers..."
                  className="resize-none h-24 bg-background"
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g. Software engineers, tech enthusiasts, remote workers"
                  className="bg-background"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 text-base group"
                disabled={!product.trim() || !audience.trim()}
              >
                <Sparkles className="w-4 h-4 mr-2 group-hover:text-amber-400 transition-colors" />
                Find Matches
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
