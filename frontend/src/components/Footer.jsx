import React from "react";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white/50 dark:bg-gray-900/90 w-full mt-auto">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
        <div className="md:flex md:justify-between">
          {/* Brand/Logo */}
          <div className="mb-6 md:mb-0">
            <a href="/" className="flex items-center">
              <img
                src="https://ik.imagekit.io/cq1p7u6vo/sample.png?updatedAt=1729335919414"
                className="h-[100px] me-3"
                alt="Your Brand Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                Health Wizard
              </span>
            </a>
          </div>
          
          {/* Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            {/* Resources */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Resources
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="/" className="hover:underline">Documentation</a>
                </li>
                <li>
                  <a href="/" className="hover:underline">Support</a>
                </li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Follow us
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                <li className="mb-4">
                  <a href="https://github.com/" className="hover:underline">
                    Github
                  </a>
                </li>
                <li>
                  <a href="https://discord.com/" className="hover:underline">
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Links */}
            <div className="social">
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                Social links
              </h2>
              <ul className="flex space-x-5 text-gray-500 dark:text-gray-400">
                <li>
                  <a
                    href="https://www.facebook.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    <FaFacebookF />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    <FaYoutube />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-gray-900 dark:hover:text-white"
                  >
                    <FaInstagram />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />

        {/* Copyright and additional links */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
            &copy; 2024 HealthWizard. All rights reserved.
          </span>
          <div className="flex mt-4 sm:justify-center sm:mt-0">
            <a
              href="/"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="/"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5"
            >
              Terms & Conditions
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
