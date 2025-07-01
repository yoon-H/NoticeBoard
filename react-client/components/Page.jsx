import { useNavigate } from "react-router-dom";

import styles from "../css/home.module.css";

export default function Page({ totalPages, currentPage }) {
  const navigate = useNavigate();

  const goToPage = (page) => {
    navigate(`?page=${page}`);
  };

  // 페이지 번호 모음
  const getPagination = (current, total, delta = 1) => {
    const result = [];

    const left = Math.max(2, current - delta);
    const right = Math.min(total - delta, current + delta);

    result.push(1);

    if (left > 2) result.push("...");

    for (let i = left; i <= right; i++) {
      result.push(i);
    }

    if (right < total - 1) result.push("...");

    if (total > 1) result.push(total);

    return result;
  };

  const result = getPagination(currentPage, totalPages);

  // 페이지 넣기

  const pages = result.map((item, idx) => {
    let element;

    if (item === "...") {
      element = <span key={idx}>...</span>;
    } else {
      element = (
        <div className={styles["page"]} key={idx}>
          <button
            type="button"
            className="page-btn"
            onClick={() => goToPage(item)}
          >
            {item}
          </button>
        </div>
      );
    }

    return element;
  });

  return <div className={styles["pages"]}>{pages}</div>;
}
