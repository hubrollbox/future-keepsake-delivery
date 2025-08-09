
import React, { useState } from "react";
import { Search, Filter, X, Calendar, User, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

const SearchFilters: React.FC<SearchFiltersProps> = ({
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
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
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
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-misty-gray h-4 w-4" />
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
              <Badge variant="secondary" className="ml-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={onClearFilters}
              className="flex items-center gap-2 text-misty-gray hover:text-steel-blue"
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
            <Badge variant="secondary" className="flex items-center gap-1">
              <Search className="h-3 w-3" />
              {filters.searchTerm}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => updateFilter("searchTerm", "")}
              />
            </Badge>
          )}
          
          {filters.status !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Estado: {statusOptions.find(s => s.value === filters.status)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => updateFilter("status", "all")}
              />
            </Badge>
          )}
          
          {(filters.dateFrom || filters.dateTo) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Data: {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yy", { locale: pt }) : "..."} - {filters.dateTo ? format(filters.dateTo, "dd/MM/yy", { locale: pt }) : "..."}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => {
                  updateFilter("dateFrom", undefined);
                  updateFilter("dateTo", undefined);
                }}
              />
            </Badge>
          )}
          
          {showUserTypeFilter && filters.userType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Tipo: {filters.userType}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => updateFilter("userType", "all")}
              />
            </Badge>
          )}
          
          {showCategoryFilter && filters.category !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Package className="h-3 w-3" />
              Categoria: {categoryOptions.find(c => c.value === filters.category)?.label}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-dusty-rose" 
                onClick={() => updateFilter("category", "all")}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <Card className="emotion-card border-dusty-rose/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-steel-blue">Estado</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => updateFilter("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date From Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-steel-blue">Data Inicial</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy", { locale: pt }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => updateFilter("dateFrom", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-steel-blue">Data Final</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: pt }) : "Selecionar"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => updateFilter("dateTo", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Category Filter */}
              {showCategoryFilter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-steel-blue">Categoria</label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) => updateFilter("category", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* User Type Filter */}
              {showUserTypeFilter && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-steel-blue">Tipo de Utilizador</label>
                  <Select
                    value={filters.userType}
                    onValueChange={(value) => updateFilter("userType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="user">Utilizador</SelectItem>
                    </SelectContent>
                  </Select>
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
