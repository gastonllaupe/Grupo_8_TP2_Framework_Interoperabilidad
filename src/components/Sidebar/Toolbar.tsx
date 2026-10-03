import {
  BarChart3,
  Receipt,
  Plus,
  Pencil,
  Sparkles,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

import "./Sidebar.css";
import Sidepanel from "../Sidepanel/Sidepanel";
import NavGroup from "../Navgroup";
import { useAuth } from "../../context/AuthContext";

import type { serviceItems } from "../../types/types";

// 1. Definimos la interfaz de las props que recibe de Dashboard
interface ToolBarProps {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

const serviceItems: serviceItems[] = [
  {
    label: "Análisis",
    icon: BarChart3,
    path: "/dashboard/analysis",
  },
  {
    label: "Facturación",
    icon: Receipt,
    path: "/dashboard/billing",
  },
  {
    label: "Agregar Servicio",
    icon: Plus,
    path: "/dashboard/services/add",
  },
  {
    label: "Modificar/Eliminar Servicio",
    icon: Pencil,
    path: "/dashboard/services/edit",
  },
];

const serviceItemsSecondary: serviceItems[] = [
  {
    label: "Notificaciones",
    icon: Bell,
    path: "/dashboard/Atomcito",
  },
  {
    label: "Atomcito",
    icon: Sparkles,
    path: "/dashboard/Atomcito",
  },
  {
    label: "Ajustes",
    icon: Settings,
    path: "/dashboard/Atomcito",
  },
];

// 2. Le asignamos los props a la función
export default function ToolBar({ collapsed, onCollapsedChange }: ToolBarProps) {
  const { user, logout } = useAuth();

  return (
    <div className="flex sticky top-0 left-0 h-screen">
      <Sidepanel width="sm" hoverExpand={true}>
        <NavGroup items={serviceItemsSecondary} layoutId="active-nav-pill" />
      </Sidepanel>

      <Sidepanel mainTitle={true} width="sm">
        <div className="flex flex-col justify-between h-full">
          <NavGroup items={serviceItems} layoutId="active-nav-pill" />

          {user && (
            <div className="mt-auto border-t border-[#CDE8E5] p-4 dark:border-[#616F39]">
              <div className="flex items-center gap-3">
                <img
                  src={user.picture}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Oculta los textos si collapsed es true */}
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{user.name}</p>
                    <p className="text-xs opacity-70 truncate">{user.email}</p>
                  </div>
                )}

                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="rounded-lg p-2 text-red-500 hover:bg-red-100/50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Sidepanel>
    </div>
  );
}