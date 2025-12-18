"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import Image from "next/image";


export default function Navbar() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const navItems = [
    { href: "/", label: "TRANG CHỦ" },
    { href: "/sukien", label: "SỰ KIỆN" },
    // { href: "/diendan", label: "DIỄN ĐÀN" },
    { href: "/shopacc", label: "SHOP ACC" },
    { href: "/bangxh", label: "BẢNG XH" },
    { href: "/user", label: "USER" },
  ]
  
  return (
    <nav className="bg-[#FFC000] shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Image 
                src="/assets/icon1.png"
                alt="Logo NR Online"
                width={100} 
                height={100}
                className="w-20 h-20"  
            />
            
        
          <ul className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`
                    relative px-5 py-2 font-bold text-sm tracking-wide
                    transition-all duration-300 rounded-lg
                    ${pathname === item.href 
                      ? "text-red-600 bg-white shadow-md" 
                      : "text-white hover:bg-yellow-400 hover:text-red-600"
                    }
                  `}
                >
                  {item.label}
                  {pathname === item.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-red-600 rounded-t-full"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
         {/* < 768px */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 hover:bg-yellow-400 rounded-lg transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* < 768px */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      block px-4 py-3 font-bold text-sm rounded-lg transition
                      ${pathname === item.href 
                        ? "text-red-600 bg-white shadow-md" 
                        : "text-white hover:bg-yellow-400 hover:text-red-600"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}