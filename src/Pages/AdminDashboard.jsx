import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Building2, Calendar, TrendingUp, 
  Users, DollarSign, Eye, Edit
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: user } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: lodges = [] } = useQuery({
    queryKey: ['admin-lodges'],
    queryFn: () => base44.entities.Lodge.list(),
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: () => base44.entities.Booking.list('-created_date'),
  });

  // Check if user is admin
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <Button onClick={() => navigate(createPageUrl("Home"))}>
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalRevenue = bookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);
  
  const thisMonthBookings = bookings.filter(b => {
    const bookingDate = new Date(b.created_date);
    const now = new Date();
    return bookingDate.getMonth() === now.getMonth() && 
           bookingDate.getFullYear() === now.getFullYear();
  });

  const thisMonthRevenue = thisMonthBookings
    .filter(b => b.payment_status === 'paid')
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const stats = [
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: DollarSign, color: "from-green-400 to-emerald-500", trend: "+12% from last month" },
    { title: "Total Bookings", value: bookings.length, icon: Calendar, color: "from-blue-400 to-blue-500", trend: `${thisMonthBookings.length} this month` },
    { title: "Available Lodges", value: lodges.filter(l => l.available).length, icon: Building2, color: "from-purple-400 to-pink-500", trend: `${lodges.length} total lodges` },
    { title: "This Month Revenue", value: `₹${thisMonthRevenue.toLocaleString()}`, icon: TrendingUp, color: "from-orange-400 to-rose-500", trend: `${thisMonthBookings.length} bookings` },
  ];

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.full_name || 'Admin'}</p>
            </div>
            <Button onClick={() => navigate(createPageUrl("ManageLodges"))} className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600">
              <Building2 className="w-4 h-4 mr-2" />
              Manage Lodges
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.trend}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="lodges">Lodges</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.slice(0, 5).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{booking.guest_name}</p>
                          <p className="text-sm text-gray-600">{booking.lodge_name}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{booking.total_price}</p>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <CardTitle>Top Performing Lodges</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {lodges.slice(0, 5).map((lodge) => {
                      const lodgeBookings = bookings.filter(b => b.lodge_id === lodge.id);
                      const revenue = lodgeBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
                      
                      return (
                        <div key={lodge.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <img
                              src={lodge.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100"}
                              alt={lodge.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{lodge.name}</p>
                              <p className="text-sm text-gray-600">{lodgeBookings.length} bookings</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-900">₹{revenue.toLocaleString()}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Booking #</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Lodge</TableHead>
                        <TableHead>Check-in</TableHead>
                        <TableHead>Check-out</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">{booking.booking_number}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{booking.guest_name}</p>
                              <p className="text-sm text-gray-600">{booking.guest_email}</p>
                            </div>
                          </TableCell>
                          <TableCell>{booking.lodge_name}</TableCell>
                          <TableCell>{format(new Date(booking.check_in), 'MMM dd, yyyy')}</TableCell>
                          <TableCell>{format(new Date(booking.check_out), 'MMM dd, yyyy')}</TableCell>
                          <TableCell className="font-bold">₹{booking.total_price}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => navigate(`${createPageUrl("BookingConfirmation")}?booking_id=${booking.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lodges Tab */}
          <TabsContent value="lodges">
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle>All Lodges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {lodges.map((lodge) => (
                    <Card key={lodge.id} className="overflow-hidden">
                      <img
                        src={lodge.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"}
                        alt={lodge.name}
                        className="w-full h-48 object-cover"
                      />
                      <CardContent className="p-4">
                        <h3 className="font-bold text-lg mb-2">{lodge.name}</h3>
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>Price: ₹{lodge.price_per_night}/night</p>
                          <p>Max Guests: {lodge.max_guests}</p>
                          <p>Type: {lodge.lodge_type?.replace(/_/g, ' ')}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`${createPageUrl("LodgeDetail")}?id=${lodge.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => navigate(`${createPageUrl("ManageLodges")}?edit=${lodge.id}`)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}


