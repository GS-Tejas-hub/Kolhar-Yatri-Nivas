import React, { useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle, Download, Mail, Home, FileText, Calendar, Users, CreditCard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import html2pdf from "html2pdf.js";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const invoiceRef = useRef();
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get('booking_id');

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: async () => {
      const bookings = await base44.entities.Booking.list();
      return bookings.find(b => b.id === bookingId);
    },
    enabled: !!bookingId,
  });

  const handleDownloadInvoice = () => {
    if (!booking) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invoice - ${booking.booking_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #f97316; padding-bottom: 20px; }
            .logo { font-size: 32px; font-weight: bold; color: #f97316; margin-bottom: 5px; }
            .subtitle { color: #666; font-size: 14px; }
            .invoice-details { margin-bottom: 30px; }
            .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #f97316; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; padding: 8px; background: #f9f9f9; }
            .label { font-weight: bold; color: #666; }
            .value { color: #333; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th { background: #f97316; color: white; padding: 12px; text-align: left; }
            .items-table td { padding: 12px; border-bottom: 1px solid #ddd; }
            .total-section { margin-top: 30px; text-align: right; }
            .total-row { display: flex; justify-content: flex-end; margin: 8px 0; font-size: 18px; }
            .total-label { margin-right: 20px; font-weight: bold; }
            .total-amount { color: #f97316; font-weight: bold; font-size: 24px; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #666; font-size: 12px; }
            .stamp { margin-top: 40px; text-align: right; color: #f97316; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🏨 Kolhar Yatri Nivas</div>
            <div class="subtitle">Your Home Away From Home</div>
            <div style="margin-top: 10px; font-size: 12px;">Kolhar, Karnataka, India | +91 98765 43210 | info@kolharyatrinivas.com</div>
          </div>

          <div class="invoice-details">
            <div class="section-title">BOOKING INVOICE / RECEIPT</div>
            <div class="info-row">
              <div><span class="label">Invoice Number:</span> <span class="value">${booking.booking_number}</span></div>
              <div><span class="label">Date:</span> <span class="value">${format(new Date(booking.created_date), 'dd MMM yyyy')}</span></div>
            </div>
            <div class="info-row">
              <div><span class="label">Payment Status:</span> <span class="value" style="color: green; font-weight: bold;">✓ PAID</span></div>
              <div><span class="label">Booking Status:</span> <span class="value">${booking.status.toUpperCase()}</span></div>
            </div>
          </div>

          <div class="invoice-details">
            <div class="section-title">GUEST INFORMATION</div>
            <div class="info-row"><span class="label">Name:</span><span class="value">${booking.guest_name}</span></div>
            <div class="info-row"><span class="label">Email:</span><span class="value">${booking.guest_email}</span></div>
            <div class="info-row"><span class="label">Phone:</span><span class="value">${booking.guest_phone}</span></div>
          </div>

          <div class="invoice-details">
            <div class="section-title">BOOKING DETAILS</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th>Nights</th>
                  <th>Guests</th>
                  <th>Rate/Night</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${booking.lodge_name}</td>
                  <td>${format(new Date(booking.check_in), 'dd MMM yyyy')}</td>
                  <td>${format(new Date(booking.check_out), 'dd MMM yyyy')}</td>
                  <td>${booking.num_nights}</td>
                  <td>${booking.num_guests}</td>
                  <td>₹${booking.price_per_night.toLocaleString()}</td>
                  <td>₹${booking.total_price.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="total-section">
            <div class="total-row"><span class="total-label">Subtotal:</span><span class="value">₹${booking.total_price.toLocaleString()}</span></div>
            <div class="total-row"><span class="total-label">Taxes & Fees:</span><span class="value">₹0</span></div>
            <div class="total-row" style="border-top: 2px solid #f97316; padding-top: 10px; margin-top: 10px;"><span class="total-label">TOTAL PAID:</span><span class="total-amount">₹${booking.total_price.toLocaleString()}</span></div>
          </div>

          ${booking.special_requests ? `
          <div class="invoice-details">
            <div class="section-title">SPECIAL REQUESTS</div>
            <div style="padding: 15px; background: #f9f9f9; border-left: 3px solid #f97316;">${booking.special_requests}</div>
          </div>` : ''}

          <div class="stamp">
            <div>Authorized Signature</div>
            <div style="margin-top: 30px;">_____________________</div>
            <div style="margin-top: 5px; font-size: 12px;">Kolhar Yatri Nivas</div>
          </div>

          <div class="footer">
            <p><strong>Terms & Conditions:</strong></p>
            <p>• Check-in time: 2:00 PM | Check-out time: 11:00 AM</p>
            <p>• Cancellation charges may apply as per our cancellation policy</p>
            <p>• Please carry a valid government-issued ID proof at the time of check-in</p>
            <p>• This is a computer-generated invoice and does not require a physical signature</p>
            <br>
            <p>Thank you for choosing Kolhar Yatri Nivas! We look forward to hosting you.</p>
            <p style="color: #f97316; font-weight: bold;">For any queries, contact us at +91 98765 43210 or info@kolharyatrinivas.com</p>
          </div>
        </body>
      </html>
    `;

    const container = document.createElement('div');
    container.innerHTML = invoiceHTML;
    const opt = {
      margin:       0.5,
      filename:     `Invoice-${booking.booking_number}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(container).set(opt).save();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking not found</h2>
          <Button onClick={() => navigate(createPageUrl("Home"))}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center mb-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">Thank you for choosing Kolhar Yatri Nivas</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-0 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Details</h2>
                  <p className="text-gray-600">Booking #{booking.booking_number}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Paid</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">₹{booking.total_price.toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Lodge</p>
                      <p className="font-semibold text-gray-900">{booking.lodge_name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-in</p>
                      <p className="font-semibold text-gray-900">{format(new Date(booking.check_in), 'EEEE, MMMM dd, yyyy')}</p>
                      <p className="text-sm text-gray-600">After 2:00 PM</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Guests</p>
                      <p className="font-semibold text-gray-900">{booking.num_guests} Guest{booking.num_guests > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Check-out</p>
                      <p className="font-semibold text-gray-900">{format(new Date(booking.check_out), 'EEEE, MMMM dd, yyyy')}</p>
                      <p className="text-sm text-gray-600">Before 11:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><CreditCard className="w-5 h-5 text-orange-600" />Payment Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-700"><span>₹{booking.price_per_night.toLocaleString()} × {booking.num_nights} nights</span><span>₹{booking.total_price.toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-orange-200"><span>Total</span><span className="text-orange-600">₹{booking.total_price.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-900"><strong>📧 Confirmation email sent!</strong> We've sent a confirmation email with your booking details and invoice to <strong>{booking.guest_email}</strong></p>
              </div>

              {booking.special_requests && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Special Requests:</p>
                  <p className="text-gray-600">{booking.special_requests}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={handleDownloadInvoice} className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"><Download className="w-5 h-5 mr-2" />Download Invoice</Button>
                <Button variant="outline" onClick={() => navigate(createPageUrl("Home"))} className="flex-1 h-12"><Home className="w-5 h-5 mr-2" />Back to Home</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Important Information</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">•</span><span>Please carry a valid government-issued ID proof at the time of check-in</span></li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">•</span><span>Check-in time is 2:00 PM and check-out time is 11:00 AM</span></li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">•</span><span>For any changes or cancellations, please contact us at least 24 hours in advance</span></li>
                <li className="flex items-start gap-2"><span className="text-orange-500 mt-1">•</span><span>For any queries, reach us at +91 98765 43210 or info@kolharyatrinivas.com</span></li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}


