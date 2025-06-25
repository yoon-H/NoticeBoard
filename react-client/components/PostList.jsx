import { Link } from "react-router-dom";

import styles from "../css/home.module.css";

export default function PostList({ list }) {
  const posts = list.map((data) => {
    return (
      <div className={styles["post"]} key={data.id}>
        <p className={styles["number"]}>{data.id}</p>
        <Link to={`/detail/${data.id}`} className={styles["title"]}>
          {data.title}
        </Link>
        <p className={styles["author"]}>{data.author}</p>
      </div>
    );
  });

  return <div>{posts}</div>;
}
