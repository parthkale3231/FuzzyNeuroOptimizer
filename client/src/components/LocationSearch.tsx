import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Loader2 } from "lucide-react";

interface LocationSearchProps {
  onLocationSelect: (lat: number, lng: number, name: string) => void;
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
    }
    setSearching(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      searchLocation();
    }
  };

  return (
    <Card data-testid="card-location-search">
      <CardContent className="p-4 space-y-3">
        <div className="flex gap-2">
          <Input
            placeholder="Search for a city or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            data-testid="input-location-search"
          />
          <Button
            onClick={searchLocation}
            disabled={searching || !searchQuery.trim()}
            data-testid="button-search-location"
          >
            {searching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {results.map((result, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onLocationSelect(
                    parseFloat(result.lat),
                    parseFloat(result.lon),
                    result.display_name
                  );
                  setResults([]);
                  setSearchQuery("");
                }}
                className="w-full text-left p-2 rounded-md hover-elevate border border-border flex items-start gap-2"
                data-testid={`button-result-${idx}`}
              >
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm">{result.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
