import { useState } from "react";
import styles from "../css/signup.module.css";
import { ID_REG, NAME_REG, PW_REG } from "../utils/validation.js";
import publicApi from "../utils/api/publicInstance.js";
import { useNavigation } from "../utils/navigate.js";

const infos = {
  id: "",
  name: "",
  password: "",
  confirmPassword: "",
};

export default function SignUp() {
  const [inputs, setInputs] = useState(infos);
  const {goToLogin} = useNavigation();

  const onChange = (e) => {
    const { name, value } = e.target;

    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const submitForm = async () => {
    if (!ID_REG.test(inputs.id)) return alert("아이디를 다시 입력해주세요.");

    if (!NAME_REG.test(inputs.name))
      return alert("닉네임을 다시 입력해주세요.");

    if (!PW_REG.test(inputs.password))
      return alert("비밀번호를 다시 입력해주세요.");

    if (inputs.password !== inputs.confirmPassword)
      return alert("비밀번호와 일치하지 않습니다.");

    try {
      const res = await publicApi.post("/auth/signup", inputs);

      if (res) goToLogin();
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
    }
  };

  return (
    <>
      <div className={styles["signup-container"]}>
        <div className={styles["signup-header"]}>
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
            <p>닉네임 </p>
            <input
              type="text"
              name="name"
              placeholder="닉네임"
              value={inputs.name}
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
          <div className={styles["input-text"]}>
            <p>비밀번호 확인 </p>
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              value={inputs.confirmPassword}
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
