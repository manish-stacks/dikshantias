  "use client";

  import {
    LayoutDashboard,
    BookOpen,
    Users,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    ChevronDown,
    ChevronRight,
    Layers,
  } from "lucide-react";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import { useState } from "react";

  export default function Sidebar() {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleLogout = () => {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    };

  const menus = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/announcement", label: "Announcement", icon: MessageSquare },
    {
      label: "Categories",
      icon: Layers,
      children: [
        { href: "/admin/categories", label: "Category" },
        { href: "/admin/categories/subcategory", label: "Subcategory" },
      ],
    },
    { href: "/admin/courses", label: "Courses", icon: BookOpen },
    { href: "/admin/current-affairs", label: "Current Affairs", icon: FileText },
    { href: "/admin/blogs", label: "Blogs", icon: FileText },
    { href: "/admin/slider", label: "Slider", icon: BookOpen },
    { href: "/admin/testimonials", label: "Testimonials", icon: Users },
    { href: "/admin/results", label: "Result", icon: FileText },
    { href: "/admin/gallery", label: "Gallery", icon: MessageSquare },
     // ✅ New Scholarship Enquiry
    { href: "/admin/scholarships", label: "Scholarship Enquiry", icon: FileText },
    {
      label: "Settings",
      icon: Settings,
      children: [
        { href: "/admin/e-learning", label: "E-Learning", icon: BookOpen },
        { href: "/admin/settings/pages", label: "Pages" },
        { href: "/admin/settings/web", label: "Web" },
      ],
    },
  ];

    return (
      <aside className="fixed top-16 left-0 w-64 h-[calc(100vh-64px)] bg-white shadow-md flex flex-col">
        <nav className="flex-1 overflow-y-auto px-3 p-6 space-y-2">
          {menus.map((item, idx) => {
            const isActive =
              item.href && pathname.startsWith(item.href);

            // Dropdown case
            if (item.children) {
              const isOpen = openDropdown === item.label;
              const isDropdownActive = item.children.some((child) =>
                pathname.startsWith(child.href)
              ); // ✅ open if any child is active

              return (
                <div key={idx} className="space-y-1">
                  <button
                    onClick={() =>
                      setOpenDropdown(isOpen ? null : item.label)
                    }
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isDropdownActive
                        ? "bg-[#e94e4e] text-white shadow-md"
                        : "text-gray-800 hover:bg-red-100 hover:text-[#e94e4e]"
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon
                        size={22}
                        className={`${
                          isDropdownActive ? "text-white" : "text-[#e94e4e]"
                        }`}
                      />
                      <span>{item.label}</span>
                    </div>
                    {isOpen ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>

                  {(isOpen || isDropdownActive) && ( 
                    <div className="ml-8 space-y-1">
                      {item.children.map((child, cIdx) => {
                        const isChildActive = pathname.startsWith(child.href); 
                        return (
                          <Link
                            key={cIdx}
                            href={child.href}
                            className={`block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                              isChildActive
                                ? "bg-red-50 text-[#e94e4e]"
                                : "text-gray-700 hover:bg-red-50 hover:text-[#e94e4e]"
                            }`}
                          >
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            // Normal menu
            return (
              <Link
                key={idx}
                href={item.href!}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#e94e4e] text-white shadow-md"
                    : "text-gray-800 hover:bg-red-100 hover:text-[#e94e4e]"
                }`}
              >
                <item.icon
                  size={22}
                  className={`${isActive ? "text-white" : "text-[#e94e4e]"}`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 w-full px-3 py-2 rounded-lg font-medium text-gray-800 hover:bg-red-100 hover:text-[#e94e4e] transition-all duration-200"
          >
            <LogOut size={22} className="text-[#e94e4e]" />
            <span>Logout</span>
          </button>
        </nav>
      </aside>
    );
  }
