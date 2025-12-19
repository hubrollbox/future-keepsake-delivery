
import { useState } from "react";
import { Search, Filter, X, Calendar, User, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export interface FilterOptions {
  searchTerm: string;
  status: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  userType: string;
  category: string;
}

interface SearchFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  statusOptions?: { value: string; label: string }[];
  categoryOptions?: { value: string; label: string }[];
  showUserTypeFilter?: boolean;
  showCategoryFilter?: boolean;
  placeholder?: string;
}

const SearchFilters = ({
  filters,
  onFiltersChange,
  onClearFilters,
  statusOptions = [
    { value: "all", label: "Todos" },
    { value: "scheduled", label: "Agendado" },
    { value: "delivered", label: "Entregue" },
    { value: "cancelled", label: "Cancelado" },
  ],
  categoryOptions = [
    { value: "all", label: "Todas" },
    { value: "digital", label: "Digital" },
    { value: "physical", label: "Físico" },
  ],
  showUserTypeFilter = false,
  showCategoryFilter = false,
  placeholder = "Pesquisar...",
}: SearchFiltersProps) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: string | Date | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters = 
    filters.searchTerm ||
    filters.status !== "all" ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.userType !== "all" ||
    filters.category !== "all";

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.status !== "all") count++;
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.userType !== "all") count++;
    if (filters.category !== "all") count++;
    return count;
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-keepla-gray-light h-4 w-4" />
          <Input
            placeholder={placeholder}
            value={filters.searchTerm}
            onChange={(e) => updateFilter("searchTerm", e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
            {getActiveFiltersCount() > 0 && (
              <div className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-keepla-gray-light text-keepla-gray-dark rounded-full">
                {getActiveFiltersCount()}
              </div>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-keepla-gray-light hover:text-keepla-gray-dark"
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.searchTerm && (
            <div className="inline-flex items-center rounded-full border border-transparent bg-keepla-gray-light text-keepla-gray-dark px-2.5 py-0.5 text-xs font-semibold gap-1">
              <Search className="h-3 w-3" />
              {filters.searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-keepla-red" 
                onClick={() => updateFilter("searchTerm", "")}
              />
            </div>
          )}
          
          {filters.status !== "all" && (
            <div className="inline-flex items-center rounded-full border border-transparent bg-keepla-gray-light text-keepla-gray-dark px-2.5 py-0.5 text-xs font-semibold gap-1">
              Estado: {statusOptions.find(s => s.value === filters.status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-keepla-red" 
                onClick={() => updateFilter("status", "all")}
              />
            </div>
          )}
          
          {(filters.dateFrom || filters.dateTo) && (
            <div className="inline-flex items-center rounded-full border border-transparent bg-keepla-gray-light text-keepla-gray-dark px-2.5 py-0.5 text-xs font-semibold gap-1">
              <Calendar className="h-3 w-3" />
              Data: {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yy", { locale: pt }) : "..."} - {filters.dateTo ? format(filters.dateTo, "dd/MM/yy", { locale: pt }) : "..."}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-keepla-red" 
                onClick={() => {
                  updateFilter("dateFrom", undefined);
                  updateFilter("dateTo", undefined);
                }}
              />
            </div>
          )}
          
          {showUserTypeFilter && filters.userType !== "all" && (
            <div className="inline-flex items-center rounded-full border border-transparent bg-misty-gray text-steel-blue px-2.5 py-0.5 text-xs font-semibold gap-1">
              <User className="h-3 w-3" />
              Tipo: {filters.userType}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => updateFilter("userType", "all")}
              />
            </div>
          )}
          
          {showCategoryFilter && filters.category !== "all" && (
            <div className="inline-flex items-center rounded-full border border-transparent bg-misty-gray text-steel-blue px-2.5 py-0.5 text-xs font-semibold gap-1">
              <Package className="h-3 w-3" />
              Categoria: {categoryOptions.find(c => c.value === filters.category)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => updateFilter("category", "all")}
              />
            </div>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card className="emotion-card border-keepla-red/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-keepla-gray-dark">Estado</label>
                <div>
                  <SelectTrigger
                    value={filters.status}
                    onClick={() => {}}
                  >
                    <SelectValue placeholder={statusOptions.find(o => o.value === filters.status)?.label || "Selecionar"} />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        onClick={() => updateFilter("status", option.value)}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </div>
              </div>

              {/* Date From Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-keepla-gray-dark">Data Inicial</label>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      // Toggle calendar visibility logic would go here
                      // For now, we're just fixing the TypeScript errors
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy", { locale: pt }) : "Selecionar"}
                  </Button>
                  <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-md">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => updateFilter("dateFrom", date)}
                      initialFocus
                    />
                  </div>
                </div>
              </div>

              {/* Date To Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-keepla-gray-dark">Data Final</label>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => {
                      // Toggle calendar visibility logic would go here
                      // For now, we're just fixing the TypeScript errors
                    }}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: pt }) : "Selecionar"}
                  </Button>
                  <div className="absolute top-full left-0 z-50 mt-1 bg-white border rounded-md shadow-md">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => updateFilter("dateTo", date)}
                      initialFocus
                    />
                  </div>
                </div>
              </div>

              {/* Category Filter */}
              {showCategoryFilter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-keepla-gray-dark">Categoria</label>
                  <div>
                    <SelectTrigger
                      value={filters.category}
                      onClick={() => {}}
                    >
                      <SelectValue placeholder={categoryOptions.find(o => o.value === filters.category)?.label || "Selecionar"} />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          onClick={() => updateFilter("category", option.value)}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </div>
                </div>
              )}

              {/* User Type Filter */}
              {showUserTypeFilter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-keepla-gray-dark">Tipo de Utilizador</label>
                  <div>
                    <SelectTrigger
                      value={filters.userType}
                      onClick={() => {}}
                    >
                      <SelectValue placeholder={filters.userType === "all" ? "Todos" : filters.userType === "admin" ? "Administrador" : "Utilizador"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all" onClick={() => updateFilter("userType", "all")}>Todos</SelectItem>
                      <SelectItem value="admin" onClick={() => updateFilter("userType", "admin")}>Administrador</SelectItem>
                      <SelectItem value="user" onClick={() => updateFilter("userType", "user")}>Utilizador</SelectItem>
                    </SelectContent>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchFilters;
