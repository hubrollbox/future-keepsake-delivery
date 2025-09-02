// import { createContext, useContext, useState, ReactNode } from 'react';

// interface SidebarContextType {
//   isOpen: boolean;
//   toggleSidebar: () => void;
//   closeSidebar: () => void;
// }

// const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// interface SidebarProviderProps {
//   children: ReactNode;
// }

export const SidebarProvider = () => {
  return null;
};

export const useSidebar = () => {
  return {
    isMobile: false,
    state: 'expanded' as 'expanded' | 'collapsed',
    openMobile: false,
    setOpenMobile: () => {},
    toggleSidebar: () => {}
  };
};