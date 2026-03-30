// FilterBar — 검색 + 필터 선택 바
import React from "react";
import { Search } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
}

interface FilterBarProps {
  onSearch: (query: string) => void;
  filters: FilterConfig[];
  onFilterChange: (key: string, value: string) => void;
  activeFilters: Record<string, string>;
  searchPlaceholder?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  filters,
  onFilterChange,
  activeFilters,
  searchPlaceholder = "검색...",
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* 검색 입력 */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          onChange={e => onSearch(e.target.value)}
          className="w-full bg-transparent border border-white/10 text-white placeholder-gray-600 font-accent text-xs tracking-wide pl-10 pr-4 py-2.5 focus:outline-none focus:border-white/20 transition-colors"
        />
      </div>

      {/* 필터 셀렉트 */}
      {filters.map(filter => (
        <select
          key={filter.key}
          value={activeFilters[filter.key] || ""}
          onChange={e => onFilterChange(filter.key, e.target.value)}
          className="bg-transparent border border-white/10 text-white font-accent text-xs tracking-wide px-4 py-2.5 focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer min-w-[140px]"
          style={{
            // 드롭다운 화살표 커스텀 (순수 CSS)
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 12px center",
            paddingRight: "36px",
          }}
        >
          {/* 기본 옵션: 필터 라벨 */}
          <option value="" className="bg-[#1a1a1a] text-gray-400">
            {filter.label}
          </option>
          {filter.options.map(opt => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-[#1a1a1a] text-white"
            >
              {opt.label}
            </option>
          ))}
        </select>
      ))}
    </div>
  );
};
