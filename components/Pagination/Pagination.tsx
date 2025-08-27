import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  pageCount: number;
  onPageChange: (selectedItem: { selected: number }) => void;
  currentPage: number;
}

export default function Pagination({ pageCount, onPageChange, currentPage }: PaginationProps) {
  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel=">"
      onPageChange={onPageChange}
      pageRangeDisplayed={3}
      marginPagesDisplayed={2}
      pageCount={pageCount}
      previousLabel="<"
      containerClassName={css.pagination}
      pageLinkClassName={css.pageLink}
      activeLinkClassName={css.activeLink}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      disabledClassName={css.disabled}
      forcePage={currentPage - 1}
    />
  );
};


