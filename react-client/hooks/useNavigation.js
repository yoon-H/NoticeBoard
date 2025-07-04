import { useNavigate } from "react-router-dom";

export function useNavigation() {
  const navigate = useNavigate();

  const goHome = () => navigate("/");
  const goToSignup = () => navigate("/signup");
  const goToLogin = () => navigate("/login");
  const goToPost = (id = null) => {
    if (id) navigate(`/post/${id}`);
    else navigate("/post");
  };
  const goToDetail = (id = null) => {
    if (id) navigate(`/detail/${id}`);
    else navigate("/detail");
  };

  const goToPage = (page) => {
    navigate(`/?page=${page}`);
  };

  return {
    goHome,
    goToSignup,
    goToLogin,
    goToPage,
    goToDetail,
    goToPost,
  };
}
