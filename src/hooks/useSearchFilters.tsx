
import { useState, useMemo } from "react";
import { FilterOptions } from "@/components/search/SearchFilters";

export const useSearchFilters = <T extends Record<string, any>>(
  data: T[],
  searchFields: (keyof T)[],
  initialFilters?: Partial<FilterOptions>
) => {
  const [filters, setFilters] = useState<FilterOptions>({
    searchTerm: "",
    status: "all",
    dateFrom: undefined,
    dateTo: undefined,
    userType: "all",
    category: "all",
    ...initialFilters,
  });

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchLower);
        });
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && item.status && item.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date(item.created_at || item.delivery_date || item.received_date);
        
        if (filters.dateFrom && itemDate < filters.dateFrom) {
          return false;
        }
        
        if (filters.dateTo && itemDate > filters.dateTo) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== "all" && item.type && item.type !== filters.category) {
        return false;
      }

      // User type filter
      if (filters.userType !== "all") {
        // This would need to be customized based on how user types are determined
        // For now, we'll skip this filter if there's no clear user type field
      }

      return true;
    });
  }, [data, filters, searchFields]);

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      status: "all",
      dateFrom: undefined,
      dateTo: undefined,
      userType: "all",
      category: "all",
    });
  };

  return {
    filters,
    setFilters,
    filteredData,
    clearFilters,
  };
};
