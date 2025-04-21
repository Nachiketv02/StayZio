import { motion } from 'framer-motion';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const renderPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(
      <motion.button
        key={1}
        onClick={() => onPageChange(1)}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1 
            ? 'bg-primary-600 text-white' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        1
      </motion.button>
    );
    
    // Calculate range of pages to show
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Adjust if we're near the start
    if (currentPage <= 3) {
      endPage = Math.min(5, totalPages - 1);
    }
    
    // Adjust if we're near the end
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 4);
    }
    
    // Add ellipsis if needed at the beginning
    if (startPage > 2) {
      pages.push(
        <span key="ellipsis-1" className="px-3 py-1">
          ...
        </span>
      );
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <motion.button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {i}
        </motion.button>
      );
    }
    
    // Add ellipsis if needed at the end
    if (endPage < totalPages - 1) {
      pages.push(
        <span key="ellipsis-2" className="px-3 py-1">
          ...
        </span>
      );
    }
    
    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      pages.push(
        <motion.button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages 
              ? 'bg-primary-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {totalPages}
        </motion.button>
      );
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center">
      <div className="inline-flex items-center shadow-sm space-x-1">
        <motion.button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-l-md ${
            currentPage === 1 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          Previous
        </motion.button>
        
        <div className="flex space-x-1 px-2">
          {renderPageNumbers()}
        </div>
        
        <motion.button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-r-md ${
            currentPage === totalPages 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          Next
        </motion.button>
      </div>
    </nav>
  );
}

export default Pagination;