import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SearchBar({ onSearch, className = "" }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.append("check_in", checkIn);
    if (checkOut) params.append("check_out", checkOut);
    if (guests) params.append("guests", guests);
    
    navigate(`${createPageUrl("Lodges")}?${params.toString()}`);
    
    if (onSearch) {
      onSearch({ checkIn, checkOut, guests: parseInt(guests) });
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-2xl p-6 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Check-in Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
          />
        </div>

        {/* Check-out Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-500" />
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split('T')[0]}
            className="border-gray-200 focus:border-orange-400 focus:ring-orange-400"
          />
        </div>

        {/* Number of Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-500" />
            Guests
          </label>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger className="border-gray-200 focus:border-orange-400 focus:ring-orange-400">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            className="w-full h-11 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Search className="w-4 h-4 mr-2" />
            Find Your Stay
          </Button>
        </div>
      </div>
    </div>
  );
}


