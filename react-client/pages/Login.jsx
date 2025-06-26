import { useNavigate } from "react-router-dom";
import styles from "../css/login.module.css";
import { useState } from "react";
import { ID_REG, PW_REG } from "../utils/validation.js";
import api from "../utils/axios.instance.js";

const infos = {
  id: "",
  password: "",
};

export default function Login({ setIsLoggedIn }) {
  const [inputs, setInputs] = useState(infos);
  const navigate = useNavigate();

  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const submitForm = async () => {
    if (!ID_REG.test(inputs.id)) return alert("아이디를 다시 입력해주세요.");

    if (!PW_REG.test(inputs.password))
      return alert("비밀번호를 다시 입력해주세요.");

    try {
      const res = await api.post("/auth/login", inputs);

      setIsLoggedIn(true);
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <div className={styles["login-container"]}>
        <div className={styles["login-header"]}>
          <div className={styles["input-text"]}>
            <p>아이디 </p>
            <input
              type="text"
              name="id"
              placeholder="아이디"
              value={inputs.id}
              onChange={onChange}
            />
          </div>
          <div className={styles["input-text"]}>
            <p>비밀번호 </p>
            <input
              type="password"
              name="password"
              placeholder="비밀번호"
              value={inputs.password}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={styles["submit"]}>
          <button
            type="submit"
            className={styles["submit-btn"]}
            onClick={submitForm}
          >
            제출
          </button>
        </div>
      </div>
    </>
  );
}
