import { useParams } from "react-router-dom";

export default function Detail() {
  const params = useParams();
  const postId = params.id;
    return (
    <>
      <div>Detaaiaiaiaiaial</div>
      <div>{postId}번 게시물 </div>
    </>
  );
}