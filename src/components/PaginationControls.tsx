import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

const PaginationControls = ({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) => {
  const navigate = useNavigate();
  return (
    <div className="flex gap-x-4 items-center pb-6">
      <Button
        variant={"ghost"}
        disabled={currentPage <= 1}
        onClick={() => navigate(`/?page=${currentPage - 1}`)}
      >
        <ChevronLeft size={26} color="black" />
      </Button>

      <p>
        <span className="font-semibold">{currentPage}</span>/{totalPages}
      </p>

      <Button
        variant={"ghost"}
        disabled={currentPage >= totalPages}
        onClick={() => navigate(`/?page=${currentPage + 1}`)}
      >
        <ChevronRight size={26} color="black" />
      </Button>
    </div>
  );
};

export default PaginationControls;
