import { createContext, useContext } from "react";
import { useTheme as useShadcnTheme } from "@/components/theme-provider";

// Re-export the useTheme hook from the theme provider
export const useTheme = useShadcnTheme;
