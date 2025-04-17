import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900">ANG Technologies</h3>
            <p className="mt-4 text-base text-gray-500">
              Your trusted partner in power backup solutions. We provide high-quality UPS systems,
              inverters, stabilizers, and more to keep your business running smoothly.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Products</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/products?type=UPS" className="text-base text-gray-500 hover:text-gray-900">
                  UPS Systems
                </Link>
              </li>
              <li>
                <Link to="/products?type=Inverter" className="text-base text-gray-500 hover:text-gray-900">
                  Inverters
                </Link>
              </li>
              <li>
                <Link to="/products?type=Stabilizer" className="text-base text-gray-500 hover:text-gray-900">
                  Stabilizers
                </Link>
              </li>
              <li>
                <Link to="/products?type=Battery" className="text-base text-gray-500 hover:text-gray-900">
                  Batteries
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="text-base text-gray-500">
                <span className="block">Email:</span>
                <a href="mailto:info@angtech.com" className="hover:text-gray-900">
                  info@angtech.com
                </a>
              </li>
              <li className="text-base text-gray-500">
                <span className="block">Phone:</span>
                <a href="tel:+1234567890" className="hover:text-gray-900">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="text-base text-gray-500">
                <span className="block">Address:</span>
                <span className="block">
                  123 Power Street
                  <br />
                  Tech City, TC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            © {new Date().getFullYear()} ANG Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
} 