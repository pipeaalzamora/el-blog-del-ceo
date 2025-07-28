import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageUrl = (page: number) => {
    const url = new URL(baseUrl, "http://localhost");
    if (page > 1) {
      url.searchParams.set("page", page.toString());
    }
    return url.pathname + url.search;
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // First page
    if (start > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          1
        </Link>
      );
      if (start > 2) {
        pages.push(
          <span
            key="ellipsis1"
            className="px-3 py-2 text-sm text-muted-foreground"
          >
            ...
          </span>
        );
      }
    }

    // Visible pages
    for (let i = start; i <= end; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`px-3 py-2 text-sm font-medium transition-colors ${
            i === currentPage
              ? "bg-primary text-primary-foreground rounded-lg"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {i}
        </Link>
      );
    }

    // Last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push(
          <span
            key="ellipsis2"
            className="px-3 py-2 text-sm text-muted-foreground"
          >
            ...
          </span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center space-x-1 ${className}`}>
      {/* Previous button */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Anterior
        </Link>
      )}

      {/* Page numbers */}
      <div className="flex items-center space-x-1">{renderPageNumbers()}</div>

      {/* Next button */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Siguiente
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      )}
    </div>
  );
}
