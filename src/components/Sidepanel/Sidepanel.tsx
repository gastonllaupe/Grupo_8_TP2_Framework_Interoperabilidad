import { Menu } from "lucide-react";
import { Link } from "react-router-dom";
import "./Sidepanel.css"

import type {
  SidepanelProps,
  customWidth,
} from "../../types/types";
import { useState } from "react";

export default function Sidepanel({
  width,
  children,
  mainTitle,
  hoverExpand=false,

}: SidepanelProps) {

  const widths: customWidth = {
    xs: "w-32",
    sm: "w-64",
    md: "w-80",
    lg: "w-96",
    xl: "w-120"
  };

  const [sidebarCollapsed, setSidebarCollapsed] = useState(hoverExpand);

  const hoverHandlers = hoverExpand
    ? {
        onMouseEnter: () => setSidebarCollapsed(false),
        onMouseLeave: () => setSidebarCollapsed(true),
      }
    : {};

  const currentWidth = hoverExpand
    ? (sidebarCollapsed ? "w-16" : widths[width])
    : widths[width];

  return (
    <div
      {...hoverHandlers}
      className={`
        h-screen
        ${currentWidth}
        shrink-0
        flex
        flex-col
        font-sans

        bg-[#4D869C]
        text-white

        border-r
        border-[#3D7183]

        dark:bg-black
        dark:border-[#222222]
        dark:text-white

        transition-smooth
        duration-200
        ease-in-out

        overflow-hidden
      `}
    >
      {/* Header */}
      <div
        className={`
          flex
          items-center
          justify-center
          px-4
          pt-5
          pb-2
        `}
      >
        {mainTitle ? (
          <Link
            to="/dashboard"
            className="
              m-5
              font-bold
              transition-opacity
              hover:opacity-80
            "
          >
            <span className="text-2xl hover:text-[#A7D129]">AtomPay</span>
          </Link>
        ) : (
          <div className="m-5">
            <Menu size={25}/>
          </div>
        )}
      </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {children}
        </div>
    </div>
  );
}