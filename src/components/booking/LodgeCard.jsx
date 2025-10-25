import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Wifi, Wind, Tv, Coffee, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const amenityIcons = {
  "Wi-Fi": Wifi,
  "WiFi": Wifi,
  "AC": Wind,
  "Air Conditioning": Wind,
  "TV": Tv,
  "Television": Tv,
  "Coffee": Coffee,
  "Breakfast": Coffee,
};

export default function LodgeCard({ lodge }) {
  const navigate = useNavigate();

  const getAmenityIcon = (amenity) => {
    const Icon = amenityIcons[amenity] || Wifi;
    return <Icon className="w-4 h-4" />;
  };

  return (
    <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-500 border-0 bg-white">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={lodge.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800"}
          alt={lodge.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Price Badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm text-gray-600">From</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            ₹{lodge.price_per_night}
          </p>
          <p className="text-xs text-gray-500">/night</p>
        </div>

        {/* Lodge Type Badge */}
        <Badge className="absolute top-4 left-4 bg-orange-500/90 backdrop-blur-sm text-white border-0">
          {lodge.lodge_type?.replace(/_/g, ' ').toUpperCase()}
        </Badge>
      </div>

      <CardContent className="p-6">
        {/* Lodge Name */}
        <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
          {lodge.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
          {lodge.short_description || lodge.description}
        </p>

        {/* Amenities & Guests */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-1 text-gray-600">
            <Users className="w-4 h-4 text-orange-500" />
            <span className="text-sm">Up to {lodge.max_guests} guests</span>
          </div>
          
          {lodge.amenities?.slice(0, 3).map((amenity, index) => (
            <div key={index} className="flex items-center gap-1 text-gray-600">
              {getAmenityIcon(amenity)}
              <span className="text-sm">{amenity}</span>
            </div>
          ))}
        </div>

        {/* View Details Button */}
        <Button
          onClick={() => navigate(`${createPageUrl("LodgeDetail")}?id=${lodge.id}`)}
          className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
}


