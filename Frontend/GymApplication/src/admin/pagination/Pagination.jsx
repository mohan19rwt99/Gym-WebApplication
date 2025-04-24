import React, { useState } from "react";
import { Button, IconButton } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

const Pagination = ({currentPage, totalPages, onPageChange}) => {

    const handlePrevious = ()=>{
        if(currentPage > 1){
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = ()=>{
        if(currentPage < totalPages){
            onPageChange(currentPage +1)
        }
    }
  return (
    <>
      <div className="flex justify-between items-center py-4">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="flex items-center gap-2 text-gray cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 text-gray cursor-pointer transition-all duration-300 hover:-translate-y-1"
        >
          Next
          <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default Pagination;
