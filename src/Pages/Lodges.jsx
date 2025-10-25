import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import LodgeCard from "../components/booking/LodgeCard";
import SearchBar from "../components/booking/SearchBar";

export default function Lodges() {
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [guestFilter, setGuestFilter] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const { data: allLodges = [], isLoading } = useQuery({
    queryKey: ['all-lodges'],
    queryFn: () => base44.entities.Lodge.list(),
  });

  // Get URL parameters for search
  const urlParams = new URLSearchParams(window.location.search);
  const urlGuests = urlParams.get('guests');

  useEffect(() => {
    if (urlGuests) {
      setGuestFilter(urlGuests);
    }
  }, [urlGuests]);

  // Filter lodges
  const filteredLodges = allLodges.filter(lodge => {
    const priceMatch = lodge.price_per_night >= priceRange[0] && lodge.price_per_night <= priceRange[1];
    const guestMatch = !guestFilter || lodge.max_guests >= parseInt(guestFilter);
    const amenityMatch = selectedAmenities.length === 0 || 
      selectedAmenities.some(amenity => lodge.amenities?.includes(amenity));
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(lodge.lodge_type);
    
    return priceMatch && guestMatch && amenityMatch && typeMatch && lodge.available;
  });

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-80 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1920"
            alt="Our Lodges"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-orange-900/60 to-rose-900/80" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Our Lodges
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90"
          >
            Find your perfect accommodation
          </motion.p>
        </div>
      </section>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <SearchBar />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Mobile Filters Toggle */}
        <div className="md:hidden mb-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block md:w-80 transition-all duration-300`}>
            <div className="bg-white rounded-2xl shadow-lg p-6 md:sticky md:top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-orange-500" />
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPriceRange([0, 20000]);
                    setSelectedAmenities([]);
                    setSelectedTypes([]);
                    setGuestFilter("");
                  }}
                  className="text-orange-600 hover:text-orange-700"
                >
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Price Range
                </Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={20000}
                  step={500}
                  className="mb-3"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>

              {/* Guest Capacity */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Guest Capacity
                </Label>
                <Select value={guestFilter} onValueChange={setGuestFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any capacity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={null}>Any capacity</SelectItem>
                    <SelectItem value="2">2+ guests</SelectItem>
                    <SelectItem value="4">4+ guests</SelectItem>
                    <SelectItem value="6">6+ guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Amenities
                </Label>
                <div className="space-y-3">
                  {["Wi-Fi", "AC", "TV", "Pool", "Parking", "Breakfast"].map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <label
                        htmlFor={amenity}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {amenity}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lodge Type */}
              <div className="mb-6">
                <Label className="text-sm font-semibold text-gray-700 mb-3 block">
                  Lodge Type
                </Label>
                <div className="space-y-3">
                  {["hotel_room", "cabin", "cottage", "suite", "deluxe"].map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => toggleType(type)}
                      />
                      <label
                        htmlFor={type}
                        className="text-sm text-gray-700 cursor-pointer capitalize"
                      >
                        {type.replace(/_/g, ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Lodges Grid */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredLodges.length} {filteredLodges.length === 1 ? 'Lodge' : 'Lodges'} Available
              </h2>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="hidden md:inline-flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-96 bg-white rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : filteredLodges.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLodges.map((lodge, index) => (
                  <motion.div
                    key={lodge.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <LodgeCard lodge={lodge} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-16 h-16 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No lodges found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more options</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


