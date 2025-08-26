export function getPaginationRange(
  currentPage: number,
  totalPages: number,
  siblingCount = 1
) {
  const totalNumbers = siblingCount * 2 + 5; // prev + next + siblings + current + 2 dots
  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftDots = leftSibling > 2;
  const showRightDots = rightSibling < totalPages - 1;

  const pages: (number | string)[] = [];

  if (!showLeftDots && showRightDots) {
    // case: halaman awal
    const leftRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => i + 1
    );
    pages.push(...leftRange, "...", totalPages);
  } else if (showLeftDots && !showRightDots) {
    // case: halaman akhir
    const rightRange = Array.from(
      { length: 3 + siblingCount * 2 },
      (_, i) => totalPages - (3 + siblingCount * 2) + 1 + i
    );
    pages.push(1, "...", ...rightRange);
  } else {
    // case: halaman tengah
    pages.push(
      1,
      "...",
      ...Array.from(
        { length: rightSibling - leftSibling + 1 },
        (_, i) => leftSibling + i
      ),
      "...",
      totalPages
    );
  }

  return pages;
}
