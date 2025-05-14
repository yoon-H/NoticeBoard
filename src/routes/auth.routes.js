import { Router } from "express";
import { config } from "../config/config.js";

const router = Router();

// 회원가입 API
router.post('/register', async (req, res) => {
    const {id, password, confirmPassword, name} = req.body;

    // 유효성 검사
    if(!config.reg.id_reg.test(id))
        new Error('아이디가 적합하지 않습니다.');
    if(!config.reg.pw_reg.test(password))
        new Error('비밀번호를 다시 입력해주세요.');
    if(!config.reg.pw_reg.test(name))
        new Error('유효하지 않는 아이디입니다.');
    if(password === confirmPassword)
        new Error('비밀번호와 확인 비밀번호가 일치하지 않습니다.');

    // 비밀번호 해싱
    

    // 데이터 저장
})

export default router;