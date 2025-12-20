import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const exploreLinks = [
    { path: "/", label: "Home" },
    { path: "/recommendations", label: "Recommendations" },
    { path: "/browse", label: "Browse" },
    { path: "/quiz", label: "Quiz" },
    { path: "/trip-planner", label: "Trip Planner" },
    { path: "/favourites", label: "Favourites" },
  ];

  const supportLinks = [
    { path: "/help", label: "Help Center" },
    { path: "/contact", label: "Contact Us" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms of Service" },
  ];

  const socialLinks = [
    { icon: FaFacebook, url: "https://facebook.com", label: "Facebook" },
    { icon: FaTwitter, url: "https://twitter.com", label: "Twitter" },
    { icon: FaInstagram, url: "https://instagram.com", label: "Instagram" },
    { icon: FaLinkedin, url: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gray-100 text-gray-700 mt-16">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 ">
          {/* Brand Description Section */}
          <div className="space-y-4 flex flex-col justify-center align-middle ">
            <h3 className="text-xl font-bold text-gray-800">
              <span className="text-orange-400">Cairo & Giza</span>{" "}
              <span className="text-gray-800">AI Travel</span>
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              Your AI-powered guide to Cairo & Giza.
            </p>

            <img src="src\media\CairoGO_logo.png" className="w-2/6" />
          </div>

          {/* Explore Section */}
          <div>
            <h4 className="text-base font-bold text-gray-800 mb-4">Explore</h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h4 className="text-base font-bold text-gray-800 mb-4">Support</h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-orange-400 transition-colors duration-200 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h4 className="text-base font-bold text-gray-800 mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-orange-400 transition-colors duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="text-xl" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-6 py-6 lg:px-20">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Cairo & Giza AI Tourist Guide. All
              rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
