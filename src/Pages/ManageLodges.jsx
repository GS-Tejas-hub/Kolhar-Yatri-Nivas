import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Save, X, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import lodgesSeed from "@/data/lodges.json";

export default function ManageLodges() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLodge, setEditingLodge] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    short_description: "",
    price_per_night: "",
    max_guests: "",
    lodge_type: "hotel_room",
    amenities: [],
    location: "",
    featured: false,
    available: true
  });

  const { data: user } = useQuery({ queryKey: ['current-user'], queryFn: () => base44.auth.me() });

  const { data: lodges = [], isLoading } = useQuery({
    queryKey: ['manage-lodges'],
    queryFn: () => base44.entities.Lodge.list('-created_date'),
  });

  const createLodgeMutation = useMutation({
    mutationFn: (lodgeData) => base44.entities.Lodge.create(lodgeData),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['manage-lodges'] }); resetForm(); },
  });

  const updateLodgeMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lodge.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['manage-lodges'] }); resetForm(); },
  });

  const deleteLodgeMutation = useMutation({
    mutationFn: (id) => base44.entities.Lodge.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['manage-lodges'] }); },
  });

  const allAmenities = ["Wi-Fi", "AC", "TV", "Breakfast", "Parking", "Pool", "Gym", "Room Service", "Kitchen", "Fireplace", "Coffee", "Garden View", "Mini Bar", "Jacuzzi", "Private Balcony", "Work Desk", "Washing Machine", "Patio"];

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      short_description: "",
      price_per_night: "",
      max_guests: "",
      lodge_type: "hotel_room",
      amenities: [],
      location: "",
      featured: false,
      available: true
    });
    setImageUrls([]);
    setEditingLodge(null);
    setIsFormOpen(false);
  };

  const handleBulkImport = async () => {
    if (!Array.isArray(lodgesSeed) || lodgesSeed.length === 0) {
      alert('No lodges found in seed file');
      return;
    }
    for (const raw of lodgesSeed) {
      const lodgeData = {
        ...raw,
        price_per_night: parseFloat(raw.price_per_night),
        max_guests: parseInt(raw.max_guests),
      };
      await createLodgeMutation.mutateAsync(lodgeData);
    }
    alert('Imported seed lodges');
  };

  const handleFileImport = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const arr = JSON.parse(text)
      if (!Array.isArray(arr)) throw new Error('JSON must be an array')
      for (const raw of arr) {
        const lodgeData = {
          ...raw,
          price_per_night: parseFloat(raw.price_per_night),
          max_guests: parseInt(raw.max_guests),
        }
        await createLodgeMutation.mutateAsync(lodgeData)
      }
      alert(`Imported ${arr.length} lodges from file`)
    } catch (err) {
      alert('Invalid JSON file')
    } finally {
      e.target.value = ''
    }
  }

  const handleEdit = (lodge) => {
    setEditingLodge(lodge);
    setFormData({
      name: lodge.name,
      description: lodge.description,
      short_description: lodge.short_description,
      price_per_night: lodge.price_per_night,
      max_guests: lodge.max_guests,
      lodge_type: lodge.lodge_type,
      amenities: lodge.amenities || [],
      location: lodge.location,
      featured: lodge.featured,
      available: lodge.available
    });
    setImageUrls(lodge.images || []);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lodgeData = { ...formData, price_per_night: parseFloat(formData.price_per_night), max_guests: parseInt(formData.max_guests), images: imageUrls };
    if (editingLodge) { await updateLodgeMutation.mutateAsync({ id: editingLodge.id, data: lodgeData }); }
    else { await createLodgeMutation.mutateAsync(lodgeData); }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    for (const file of files) {
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        setImageUrls(prev => [...prev, file_url]);
      } catch (error) {
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  const toggleAmenity = (amenity) => {
    setFormData(prev => ({ ...prev, amenities: prev.amenities.includes(amenity) ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity] }));
  };

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <Button onClick={() => navigate(createPageUrl("Home"))}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Manage Lodges</h1>
            <p className="text-gray-600">Add, edit, or remove lodge properties</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(createPageUrl("AdminDashboard"))}>Back to Dashboard</Button>
            <Button onClick={() => setIsFormOpen(true)} className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"><Plus className="w-4 h-4 mr-2" />Add New Lodge</Button>
            <Button variant="outline" onClick={handleBulkImport}><Upload className="w-4 h-4 mr-2" />Import Seed</Button>
            <label className="inline-flex items-center gap-2 cursor-pointer border border-gray-300 rounded-md px-3 py-2 text-sm">
              <Upload className="w-4 h-4" />
              Import JSON
              <input type="file" accept="application/json" onChange={handleFileImport} className="hidden" />
            </label>
          </div>
        </div>

        {isFormOpen && (
          <Card className="border-0 shadow-2xl mb-8">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-rose-500 text-white">
              <CardTitle>{editingLodge ? 'Edit Lodge' : 'Add New Lodge'}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Lodge Name *</Label>
                    <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="lodge_type">Lodge Type *</Label>
                    <Select value={formData.lodge_type} onValueChange={(value) => setFormData({...formData, lodge_type: value})}>
                      <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel_room">Hotel Room</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="cottage">Cottage</SelectItem>
                        <SelectItem value="suite">Suite</SelectItem>
                        <SelectItem value="deluxe">Deluxe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Night (₹) *</Label>
                    <Input id="price" type="number" value={formData.price_per_night} onChange={(e) => setFormData({...formData, price_per_night: e.target.value})} required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="max_guests">Max Guests *</Label>
                    <Input id="max_guests" type="number" value={formData.max_guests} onChange={(e) => setFormData({...formData, max_guests: e.target.value})} required className="mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} placeholder="e.g., Kolhar Main Building, Floor 2" className="mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="short_description">Short Description</Label>
                    <Input id="short_description" value={formData.short_description} onChange={(e) => setFormData({...formData, short_description: e.target.value})} placeholder="Brief description for cards" className="mt-2" />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Full Description *</Label>
                    <Textarea id="description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required className="mt-2 h-32" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {allAmenities.map((amenity) => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox id={amenity} checked={formData.amenities.includes(amenity)} onCheckedChange={() => toggleAmenity(amenity)} />
                          <label htmlFor={amenity} className="text-sm cursor-pointer">{amenity}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Images</Label>
                    <div className="mt-2">
                      <Input type="file" accept="image/*" multiple onChange={handleImageUpload} className="mb-3" />
                      {imageUrls.length > 0 && (
                        <div className="grid grid-cols-4 gap-3">
                          {imageUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img src={url} alt={`Preview ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                              <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => setImageUrls(prev => prev.filter((_, i) => i !== index))}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2"><Checkbox id="featured" checked={formData.featured} onCheckedChange={(checked) => setFormData({...formData, featured: checked})} /><label htmlFor="featured" className="text-sm cursor-pointer">Featured on Home Page</label></div>
                  <div className="flex items-center space-x-2"><Checkbox id="available" checked={formData.available} onCheckedChange={(checked) => setFormData({...formData, available: checked})} /><label htmlFor="available" className="text-sm cursor-pointer">Available for Booking</label></div>
                </div>
                <div className="flex justify-end gap-3 pt-6 border-t">
                  <Button type="button" variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-2" />Cancel</Button>
                  <Button type="submit" className="bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600"><Save className="w-4 h-4 mr-2" />{editingLodge ? 'Update Lodge' : 'Create Lodge'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lodges.map((lodge) => (
            <Card key={lodge.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="relative h-48">
                <img src={lodge.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400"} alt={lodge.name} className="w-full h-full object-cover" />
                {lodge.featured && (<div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Featured</div>)}
                {!lodge.available && (<div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">Unavailable</div>)}
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">{lodge.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{lodge.short_description}</p>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p className="font-bold text-orange-600">₹{lodge.price_per_night}/night</p>
                  <p>Max Guests: {lodge.max_guests}</p>
                  <p>Type: {lodge.lodge_type?.replace(/_/g, ' ')}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(lodge)}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                  <Button variant="destructive" size="sm" onClick={() => { if (confirm('Are you sure you want to delete this lodge?')) { deleteLodgeMutation.mutate(lodge.id); } }}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


