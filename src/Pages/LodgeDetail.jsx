import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  MapPin, Users, Star, Wifi, Wind, Tv, Coffee, Utensils, 
  Car, Dumbbell, Calendar, ArrowLeft, Phone, Mail 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, differenceInDays, parseISO } from "date-fns";

const amenityIcons = {
  "Wi-Fi": Wifi,
  "WiFi": Wifi,
  "AC": Wind,
  "Air Conditioning": Wind,
  "TV": Tv,
  "Television": Tv,
  "Coffee": Coffee,
  "Breakfast": Utensils,
  "Parking": Car,
  "Gym": Dumbbell,
};

export default function LodgeDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const lodgeId = urlParams.get('id');

  const [checkIn, setCheckIn] = useState(urlParams.get('check_in') || "");
  const [checkOut, setCheckOut] = useState(urlParams.get('check_out') || "");
  const [numGuests, setNumGuests] = useState(parseInt(urlParams.get('guests')) || 2);
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: lodge, isLoading } = useQuery({
    queryKey: ['lodge', lodgeId],
    queryFn: async () => {
      const lodges = await base44.entities.Lodge.list();
      return lodges.find(l => l.id === lodgeId);
    },
    enabled: !!lodgeId,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['lodge-bookings', lodgeId],
    queryFn: () => base44.entities.Booking.filter({ lodge_id: lodgeId, status: 'confirmed' }),
    enabled: !!lodgeId,
  });

  useEffect(() => {
    if (lodge?.images?.length > 0 && !selectedImage) {
      setSelectedImage(0);
    }
  }, [lodge]);

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !lodge) return 0;
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    return nights > 0 ? nights * lodge.price_per_night : 0;
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
    return nights > 0 ? nights : 0;
  };

  const isDateBooked = (date) => {
    return bookings.some(booking => {
      const start = new Date(booking.check_in);
      const end = new Date(booking.check_out);
      const checkDate = new Date(date);
      return checkDate >= start && checkDate <= end;
    });
  };

  const handleBookNow = () => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    const nights = calculateNights();
    if (nights <= 0) {
      alert("Check-out date must be after check-in date");
      return;
    }

    navigate(`${createPageUrl("Checkout")}?lodge_id=${lodgeId}&check_in=${checkIn}&check_out=${checkOut}&guests=${numGuests}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!lodge) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Lodge not found</h2>
          <Button onClick={() => navigate(createPageUrl("Lodges"))}>
            View All Lodges
          </Button>
        </div>
      </div>
    );
  }

  const images = lodge.images?.length > 0 
    ? lodge.images 
    : ["https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Lodges"))}
          className="mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Lodges
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden border-0 shadow-xl">
              <div className="relative h-96">
                <img
                  src={images[selectedImage]}
                  alt={lodge.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-4 left-4 bg-orange-500 text-white border-0 text-sm">
                  {lodge.lodge_type?.replace(/_/g, ' ').toUpperCase()}
                </Badge>
              </div>
              <div className="p-4 bg-white">
                <div className="grid grid-cols-4 gap-2">
                  {images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-orange-500' : 'border-transparent'
                      }`}
                    >
                      <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </Card>

            {/* Lodge Details */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{lodge.name}</h1>
                
                <div className="flex items-center gap-4 text-gray-600 mb-6">
                  <div className="flex items-center gap-1">
                    <Users className="w-5 h-5 text-orange-500" />
                    <span>Up to {lodge.max_guests} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <span>{lodge.location || "Kolhar"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span>4.8 (125 reviews)</span>
                  </div>
                </div>

                <div className="prose prose-gray max-w-none mb-8">
                  <p className="text-gray-700 leading-relaxed">{lodge.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {lodge.amenities?.map((amenity, index) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <Icon className="w-5 h-5 text-orange-600" />
                          <span className="text-gray-800 font-medium">{amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Owner */}
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Owner</h2>
                <p className="text-gray-600 mb-6">Have questions? Get in touch with us directly.</p>
                <div className="flex gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Widget - Sticky */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-2xl sticky top-24">
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                      ₹{lodge.price_per_night}
                    </span>
                    <span className="text-gray-600">/night</span>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="border-gray-200 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                      className="border-gray-200 focus:border-orange-400"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-orange-500" />
                      Guests
                    </label>
                    <Input
                      type="number"
                      value={numGuests}
                      onChange={(e) => setNumGuests(parseInt(e.target.value) || 1)}
                      min={1}
                      max={lodge.max_guests}
                      className="border-gray-200 focus:border-orange-400"
                    />
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkIn && checkOut && calculateNights() > 0 && (
                  <div className="bg-orange-50 rounded-xl p-4 mb-6 space-y-2">
                    <div className="flex justify-between text-gray-700">
                      <span>₹{lodge.price_per_night} × {calculateNights()} nights</span>
                      <span>₹{calculateTotalPrice()}</span>
                    </div>
                    <div className="border-t border-orange-200 pt-2 flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-orange-600">₹{calculateTotalPrice()}</span>
                    </div>
                  </div>
                )}

                {/* Book Button */}
                <Button
                  onClick={handleBookNow}
                  disabled={!checkIn || !checkOut || calculateNights() <= 0}
                  className="w-full h-12 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  You won't be charged yet
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}


