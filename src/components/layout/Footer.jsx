import React from 'react'
import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiArrowRight, FiHeart } from 'react-icons/fi'

const Footer = () => {
  const year = new Date().getFullYear()

  const quickLinks = [
    {
      title: 'Company',
      links: [
        { label: 'About RouteRush', to: '/contact' },
        { label: 'Careers', to: '/contact' },
        { label: 'Press & Media', to: '/contact' },
        { label: 'Blog', to: '/contact' },
      ]
    },
    {
      title: 'Services',
      links: [
        { label: 'Search Buses', to: '/search' },
        { label: 'My Bookings', to: '/my-bookings' },
        { label: 'Operator Login', to: '/auth' },
        { label: 'Special Offers', to: '/search' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', to: '/contact' },
        { label: 'FAQ', to: '/contact#faq' },
        { label: 'Cancellation Policy', to: '/contact' },
        { label: 'Privacy Policy', to: '/contact' },
      ]
    },
  ]

  return (
    <footer className="bg-charcoal dark:bg-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img
                src="/bus-logo.jpg"
                alt="RouteRush Logo"
                className="w-8 h-8 rounded-xl object-cover shadow-sm ring-1 ring-white/15 group-hover:scale-105 transition-transform duration-200"
              />
              <span className="text-2xl font-black font-display tracking-tight">
                <span className="text-brand-primary">Route</span>
                <span className="text-white">Rush</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              India's smartest intercity bus booking platform. Travel smarter, travel safer, travel with RouteRush.
            </p>
            {/* Contact */}
            <div className="space-y-3">
              <a href="tel:+916379585628" className="flex items-center gap-3 text-gray-400 hover:text-brand-primary text-sm transition-colors">
                <FiPhone size={15} />
                +91 63795 85628
              </a>
              <a href="mailto:support@routerush.in" className="flex items-center gap-3 text-gray-400 hover:text-brand-primary text-sm transition-colors">
                <FiMail size={15} />
                support@routerush.in
              </a>
              <p className="flex items-center gap-3 text-gray-400 text-sm">
                <FiMapPin size={15} />
                Chennai, Tamil Nadu, India
              </p>
            </div>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[FiFacebook, FiTwitter, FiInstagram, FiYoutube].map((Icon, i) => (
                <button
                  key={i}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-brand-primary transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {quickLinks.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-brand-primary text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="font-bold text-white mb-1">Stay updated with RouteRush</h4>
              <p className="text-gray-400 text-sm">Get the best deals and travel tips in your inbox.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary transition-colors"
              />
              <button className="px-4 py-2.5 bg-brand-primary hover:bg-brand-hover rounded-xl text-sm font-semibold text-white transition-colors flex items-center gap-2 flex-shrink-0">
                Subscribe <FiArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-500">
          <p className="flex items-center gap-1.5 flex-wrap">
            <span>© {year} RouteRush. All rights reserved. Built with</span>
            <FiHeart className="text-brand-primary fill-brand-primary inline" size={14} />
            <span>in India.</span>
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-brand-primary transition-colors">Privacy</Link>
            <Link to="/contact" className="hover:text-brand-primary transition-colors">Terms</Link>
            <Link to="/contact" className="hover:text-brand-primary transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
