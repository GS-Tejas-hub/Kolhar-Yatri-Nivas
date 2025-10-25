import React from "react";
import { motion } from "framer-motion";
import { Award, Heart, Users, Shield, Star, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const stats = [
    { number: "500+", label: "Happy Guests" },
    { number: "50+", label: "Premium Rooms" },
    { number: "15+", label: "Years Experience" },
    { number: "4.9", label: "Average Rating" },
  ];

  const values = [
    {
      icon: Heart,
      title: "Hospitality First",
      description: "We treat every guest like family, ensuring comfort and satisfaction in every interaction."
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Our commitment to maintaining the highest standards sets us apart in the hospitality industry."
    },
    {
      icon: Shield,
      title: "Safety & Security",
      description: "Your safety is paramount. We maintain strict security protocols and hygiene standards."
    },
    {
      icon: Users,
      title: "Community Focus",
      description: "We're deeply rooted in the local community, supporting local businesses and culture."
    },
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "Founder & Managing Director",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400"
    },
    {
      name: "Priya Sharma",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    },
    {
      name: "Amit Patel",
      role: "Guest Relations Head",
      image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920"
            alt="About Us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-orange-900/60 to-rose-900/80" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Discover the story behind Kolhar Yatri Nivas and our commitment to exceptional hospitality
          </p>
        </motion.div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded in 2010, Kolhar Yatri Nivas began with a simple vision: to provide travelers 
                  with a home away from home. Nestled in the serene landscapes of Kolhar, we've grown 
                  from a small guesthouse to a premier hospitality destination.
                </p>
                <p>
                  What started as a family-run establishment has blossomed into a trusted name in 
                  hospitality, welcoming guests from across India and around the world. Our journey 
                  has been marked by countless stories of joy, celebration, and unforgettable memories 
                  created within our walls.
                </p>
                <p>
                  Today, we continue to uphold the values that made us who we are: genuine warmth, 
                  attention to detail, and an unwavering commitment to making every stay special. 
                  Each member of our team is dedicated to ensuring that your experience exceeds 
                  expectations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600"
                alt="Our Property"
                className="rounded-2xl shadow-xl h-64 w-full object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600"
                alt="Our Rooms"
                className="rounded-2xl shadow-xl h-64 w-full object-cover mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-rose-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <div className="text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-white/90 text-lg">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl flex items-center justify-center">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The passionate people behind your memorable stay
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-orange-600 font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-rose-400 rounded-2xl flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Located in the heart of Kolhar, surrounded by natural beauty and easily accessible 
              from major cities. We're here to welcome you with open arms.
            </p>
            <div className="inline-flex items-center gap-2 text-gray-700 text-lg">
              <MapPin className="w-5 h-5 text-orange-500" />
              <span className="font-medium">Kolhar, Karnataka, India</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}


