import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, Lock, ArrowLeft, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format, differenceInDays, parseISO } from "date-fns";

export default function Checkout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const urlParams = new URLSearchParams(window.location.search);
  
  const lodgeId = urlParams.get('lodge_id');
  const checkIn = urlParams.get('check_in');
  const checkOut = urlParams.get('check_out');
  const numGuests = parseInt(urlParams.get('guests')) || 2;

  const [guestInfo, setGuestInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    special_requests: ""
  });

  const [paymentInfo, setPaymentInfo] = useState({
    card_number: "",
    expiry: "",
    cvv: "",
    cardholder_name: ""
  });

  const [isProcessing, setIsProcessing] = useState(false);

  const { data: lodge, isLoading } = useQuery({
    queryKey: ['lodge', lodgeId],
    queryFn: async () => {
      const lodges = await base44.entities.Lodge.list();
      return lodges.find(l => l.id === lodgeId);
    },
    enabled: !!lodgeId,
  });

  const createBookingMutation = useMutation({
    mutationFn: (bookingData) => base44.entities.Booking.create(bookingData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      navigate(`${createPageUrl("BookingConfirmation")}?booking_id=${data.id}`);
    },
  });

  if (!lodgeId || !checkIn || !checkOut) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid booking details</h2>
          <Button onClick={() => navigate(createPageUrl("Lodges"))}>
            View All Lodges
          </Button>
        </div>
      </div>
    );
  }

  const nights = differenceInDays(parseISO(checkOut), parseISO(checkIn));
  const totalPrice = lodge ? nights * lodge.price_per_night : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!guestInfo.full_name || !guestInfo.email || !guestInfo.phone) {
      alert("Please fill in all guest information fields");
      return;
    }

    if (!paymentInfo.card_number || !paymentInfo.expiry || !paymentInfo.cvv || !paymentInfo.cardholder_name) {
      alert("Please fill in all payment information fields");
      return;
    }

    setIsProcessing(true);

    try {
      const bookingNumber = `KYN${Date.now().toString().slice(-8)}`;
      
      const bookingData = {
        lodge_id: lodgeId,
        lodge_name: lodge.name,
        guest_name: guestInfo.full_name,
        guest_email: guestInfo.email,
        guest_phone: guestInfo.phone,
        check_in: checkIn,
        check_out: checkOut,
        num_guests: numGuests,
        num_nights: nights,
        price_per_night: lodge.price_per_night,
        total_price: totalPrice,
        status: "confirmed",
        payment_status: "paid",
        booking_number: bookingNumber,
        special_requests: guestInfo.special_requests
      };

      await createBookingMutation.mutateAsync(bookingData);
    } catch (error) {
      alert("Booking failed. Please try again.");
      console.error("Booking error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </Button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Complete Your Booking</h1>
          <p className="text-lg text-gray-600">Just a few more steps to secure your stay</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Guest Info & Payment */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest Information */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl">Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input id="full_name" value={guestInfo.full_name} onChange={(e) => setGuestInfo({...guestInfo, full_name: e.target.value})} placeholder="John Doe" required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" value={guestInfo.email} onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})} placeholder="john@example.com" required className="mt-2" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input id="phone" type="tel" value={guestInfo.phone} onChange={(e) => setGuestInfo({...guestInfo, phone: e.target.value})} placeholder="+91 98765 43210" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="special_requests">Special Requests (Optional)</Label>
                    <Textarea id="special_requests" value={guestInfo.special_requests} onChange={(e) => setGuestInfo({...guestInfo, special_requests: e.target.value})} placeholder="Any special requirements or requests..." className="mt-2 h-24" />
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2"><Lock className="w-5 h-5 text-green-600" />Secure Payment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-3 mb-4">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-8" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/RuPay.svg" alt="RuPay" className="h-8" />
                  </div>
                  <div>
                    <Label htmlFor="cardholder_name">Cardholder Name *</Label>
                    <Input id="cardholder_name" value={paymentInfo.cardholder_name} onChange={(e) => setPaymentInfo({...paymentInfo, cardholder_name: e.target.value})} placeholder="Name on card" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="card_number">Card Number *</Label>
                    <div className="relative mt-2">
                      <Input id="card_number" value={paymentInfo.card_number} onChange={(e) => setPaymentInfo({...paymentInfo, card_number: e.target.value})} placeholder="1234 5678 9012 3456" maxLength={19} required />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date *</Label>
                      <Input id="expiry" value={paymentInfo.expiry} onChange={(e) => setPaymentInfo({...paymentInfo, expiry: e.target.value})} placeholder="MM/YY" maxLength={5} required className="mt-2" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input id="cvv" type="password" value={paymentInfo.cvv} onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})} placeholder="123" maxLength={3} required className="mt-2" />
                    </div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                    <p className="text-sm text-blue-900">Your payment information is encrypted and secure. We use industry-standard SSL encryption.</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-2xl sticky top-24">
                <CardHeader className="bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-t-xl">
                  <CardTitle className="text-xl">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="rounded-lg overflow-hidden">
                    <img src={lodge?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"} alt={lodge?.name} className="w-full h-40 object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{lodge?.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{lodge?.lodge_type?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Check-in</span><span className="font-medium text-gray-900">{format(parseISO(checkIn), 'MMM dd, yyyy')}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Check-out</span><span className="font-medium text-gray-900">{format(parseISO(checkOut), 'MMM dd, yyyy')}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Guests</span><span className="font-medium text-gray-900">{numGuests}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-gray-600">Nights</span><span className="font-medium text-gray-900">{nights}</span></div>
                  </div>
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-gray-600">₹{lodge?.price_per_night} × {nights} nights</span><span className="font-medium text-gray-900">₹{totalPrice}</span></div>
                  </div>
                  <div className="border-t-2 border-gray-300 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">₹{totalPrice}</span>
                    </div>
                  </div>
                  <Button type="submit" disabled={isProcessing} className="w-full h-12 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                    {isProcessing ? (<><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />Processing...</>) : (<><CheckCircle className="w-5 h-5 mr-2" />Confirm & Pay</>)}
                  </Button>
                  <p className="text-xs text-gray-500 text-center">By confirming, you agree to our Terms & Conditions</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


