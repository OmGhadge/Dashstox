"use client";

import { Mail, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  return (
    <section className="py-20 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Contact Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or feedback? Reach out to our team and we’ll get back to you as soon as possible.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-6 w-6 text-blue-600" />
              <span className="text-gray-700 text-lg">support@dashstox.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-green-600" />
              <span className="text-gray-700 text-lg">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6 text-indigo-600" />
              <span className="text-gray-700 text-lg">123 Market St, New York, NY</span>
            </div>
          </div>
          {/* Contact Form */}
          <form className="bg-gray-50 rounded-lg p-8 border border-gray-200 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your Name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" rows={4} placeholder="How can we help?" />
            </div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
} 