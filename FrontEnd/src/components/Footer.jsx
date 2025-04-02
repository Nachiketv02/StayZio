import { motion } from 'framer-motion'

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
              Stayzio
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your gateway to extraordinary stays and unforgettable experiences worldwide.
            </p>
          </div>
          {[
            {
              title: "Company",
              links: ["About", "Careers", "Press", "Blog"]
            },
            {
              title: "Support",
              links: ["Help Center", "Safety", "Cancellation", "COVID-19"]
            },
            {
              title: "Legal",
              links: ["Privacy", "Terms", "Sitemap", "Destinations"]
            }
          ].map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <motion.a 
                      href="#" 
                      className="text-gray-400 hover:text-white transition-colors"
                      whileHover={{ x: 5 }}
                    >
                      {link}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© 2025 Stayzio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer