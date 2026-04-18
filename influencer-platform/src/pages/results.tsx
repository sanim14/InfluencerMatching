import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useSearchParams } from "@/hooks/use-search-params";
import { useRecommendInfluencers, useGenerateOutreach } from "@workspace/api-client-react";
import type { Influencer } from "@workspace/api-zod/src/generated/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Target, ArrowLeft, Instagram, Youtube, Users, MessageSquare, Copy, Mail, RefreshCw, Loader2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Use a simple SiTiktok icon substitution since we can't easily import react-icons here dynamically
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04 1.56.06 3.12.3 4.54 1.05.54.29 1.05.65 1.48 1.09.43.44.78.96 1.03 1.54.26.58.42 1.21.46 1.86.05.7.04 1.4.04 2.1v.04c-1.02-.32-2.1-.51-3.2-.55-1.12-.04-2.25.07-3.33.32-.45.1-.9.24-1.33.42V15.1c-.04 1.34-.34 2.66-.88 3.87-.54 1.22-1.32 2.32-2.3 3.18-.98.86-2.14 1.48-3.4 1.82-1.25.33-2.58.4-3.88.18-1.28-.21-2.51-.7-3.6-1.42-1.08-.73-1.99-1.7-2.62-2.84-.63-1.15-1.02-2.45-1.13-3.8-.1-1.34.05-2.69.45-3.96.4-1.26 1-2.44 1.77-3.46.77-1.03 1.72-1.87 2.82-2.47 1.1-.6 2.32-.96 3.58-1.06 1.26-.1 2.55.06 3.77.45.6.18 1.18.43 1.73.74v-3.7c-1.3-.23-2.64-.32-3.97-.24-2.4.15-4.73 1-6.72 2.45-1.98 1.46-3.52 3.47-4.43 5.8-1.07 2.76-1.26 5.8-.52 8.65.74 2.86 2.33 5.37 4.54 7.2 2.2 1.83 5.02 2.88 7.94 2.96 2.93.08 5.8-1.8 7.37-4.37 1.1-1.8 1.6-3.9 1.46-6.02-.02-.3-.02-.6-.05-.9V7.9c1.64 1.2 3.63 1.94 5.72 2.1.2.02.4.03.6.04V6.15c-1.63-.12-3.23-.62-4.66-1.46-1.44-.84-2.67-2.03-3.5-3.47-.28-.48-.5-.98-.7-1.5-.15-.4-.28-.82-.37-1.24H12.525v.04z" />
  </svg>
);

const PlatformIcon = ({ platform, className }: { platform: string, className?: string }) => {
  switch (platform) {
    case "Instagram": return <Instagram className={className} />;
    case "TikTok": return <TikTokIcon className={className} />;
    case "YouTube": return <Youtube className={className} />;
    default: return <Users className={className} />;
  }
};

function InfluencerCard({ 
  influencer, 
  product, 
  audience 
}: { 
  influencer: Influencer, 
  product: string, 
  audience: string 
}) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [outreachMessage, setOutreachMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const generateMutation = useGenerateOutreach();

  const handleGenerateOutreach = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
    
    generateMutation.mutate(
      { data: { influencer, product, audience } },
      {
        onSuccess: (res) => {
          setOutreachMessage(res.message);
        },
        onError: () => {
          toast({
            title: "Failed to generate outreach",
            description: "Please try again later.",
            variant: "destructive"
          });
        }
      }
    );
  };

  const handleCopy = async () => {
    if (!outreachMessage) return;
    try {
      await navigator.clipboard.writeText(outreachMessage);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({ title: "Copied to clipboard", duration: 2000 });
    } catch (err) {
      toast({ title: "Failed to copy", variant: "destructive" });
    }
  };

  const handleOpenEmail = () => {
    if (!outreachMessage) return;
    const url = `https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(outreachMessage)}`;
    window.open(url, "_blank");
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden border-border/60 hover:border-border transition-colors">
      <CardHeader className="pb-3 border-b border-border/40 bg-muted/20">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-none">{influencer.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <PlatformIcon platform={influencer.platform} className="w-3.5 h-3.5" />
              <span>{influencer.platform}</span>
              <span>•</span>
              <span>{influencer.audienceSize} ({influencer.audience})</span>
            </div>
          </div>
          <Badge variant={influencer.score >= 90 ? "default" : "secondary"} className="font-mono font-medium">
            {influencer.score}% Match
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 py-4 space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Niche</span>
            <span className="text-sm font-medium">{influencer.niche}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Engagement</span>
            <span className="text-sm font-medium">{influencer.engagement}</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-border/40">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {influencer.reasoning}
          </p>
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-border/60 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outreach Message</span>
            </div>
            
            {generateMutation.isPending ? (
              <div className="bg-muted/30 rounded-md p-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ) : outreachMessage ? (
              <div className="bg-muted/30 rounded-md p-4 text-sm whitespace-pre-wrap font-sans leading-relaxed border border-border/40">
                {outreachMessage}
              </div>
            ) : (
              <div className="bg-destructive/10 text-destructive text-sm rounded-md p-4">
                Failed to load message.
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-0 pb-4 px-4 flex flex-col gap-2">
        {!isExpanded ? (
          <Button 
            className="w-full" 
            variant="outline" 
            onClick={handleGenerateOutreach}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Generate Outreach
          </Button>
        ) : (
          <div className="w-full flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleGenerateOutreach}
              disabled={generateMutation.isPending}
              title="Regenerate"
            >
              <RefreshCw className={`w-4 h-4 ${generateMutation.isPending ? 'animate-spin' : ''}`} />
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleCopy}
              disabled={generateMutation.isPending || !outreachMessage}
            >
              {isCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
              {isCopied ? "Copied" : "Copy"}
            </Button>
            
            <Button 
              className="flex-1 bg-primary text-primary-foreground"
              onClick={handleOpenEmail}
              disabled={generateMutation.isPending || !outreachMessage}
            >
              <Mail className="w-4 h-4 mr-2" />
              Gmail
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}

export default function Results() {
  const [, setLocation] = useLocation();
  const searchParams = useSearchParams();
  
  const product = searchParams.get("product") || "";
  const audience = searchParams.get("audience") || "";
  
  const [platformFilter, setPlatformFilter] = useState("All");
  const [sizeFilter, setSizeFilter] = useState("All");

  const recommendMutation = useRecommendInfluencers();
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!product || !audience) {
      setLocation("/");
      return;
    }

    if (!hasFetched) {
      setHasFetched(true);
      recommendMutation.mutate(
        { data: { product, audience } },
        {
          onSuccess: (data) => {
            console.log("API RESPONSE:", data);
            setInfluencers(data.influencers);
          }
        }
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, audience, hasFetched, setLocation]);

  const filteredInfluencers = influencers.filter(inf => {
    if (platformFilter !== "All" && inf.platform !== platformFilter) return false;
    if (sizeFilter !== "All" && inf.audienceSize !== sizeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted transition-colors">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </Link>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="font-semibold tracking-tight">Reach</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Campaign Matches</h1>
            <p className="text-muted-foreground">
              Based on: <span className="font-medium text-foreground">{product}</span> for <span className="font-medium text-foreground">{audience}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center py-4 border-y border-border/40">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Platform</span>
              <Select value={platformFilter} onValueChange={setPlatformFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Platforms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Platforms</SelectItem>
                  <SelectItem value="Instagram">Instagram</SelectItem>
                  <SelectItem value="TikTok">TikTok</SelectItem>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Size</span>
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Sizes</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="sm:ml-auto">
              <span className="text-sm text-muted-foreground">
                Showing {filteredInfluencers.length} results
              </span>
            </div>
          </div>
        </div>

        {recommendMutation.isPending ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground font-medium animate-pulse">Analyzing creator profiles...</p>
          </div>
        ) : filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInfluencers.map((influencer) => (
              <InfluencerCard 
                key={influencer.id} 
                influencer={influencer} 
                product={product} 
                audience={audience} 
              />
            ))}
          </div>
        ) : hasFetched ? (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-border rounded-xl bg-muted/10">
            <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No matches found</h3>
            <p className="text-muted-foreground max-w-sm">
              We couldn't find any influencers matching these specific filters. Try adjusting your platform or size criteria.
            </p>
            {(platformFilter !== "All" || sizeFilter !== "All") && (
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => { setPlatformFilter("All"); setSizeFilter("All"); }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}
