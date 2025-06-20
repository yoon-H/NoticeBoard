import { Link } from "react-router-dom";

export default function PostList({ list }) {
  const posts = list.map((data) => {
    return (
      <div className="post" key={data.id}>
        <p className="number">{data.id}</p>
        <Link to={`/detail/${data.id}`} className="title">
          {data.title}
        </Link>
        <p className="author">{data.author}</p>
      </div>
    );
  });

  return <div>{posts}</div>;
}
