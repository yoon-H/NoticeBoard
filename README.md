# NoticeBoard

## 기능

### 1.0.0
유저 : 회원가입, 로그인 (auth.routes.js)

게시글 : 작성, 조회, 수정, 삭제 (post.routes.js)

댓글 : 작성, 조회, 수정, 삭제 (comment.routes.js)

### 2.0.0
업데이트 컬럼 추가

상태 코드 정리

프론트엔드 구현

페이지네이션 구현

### 3.0.0

글 생성, 수정 날짜 전달

함수 파라미터 묶어 보내기

댓글 조회 게시글 검사 + 댓글 조회 두 가지로 분리

댓글을 작성할 때 게시글 삭제될 경우 예외 처리. -> soft delete 리팩터링

내용이 동일할 때 update 될 경우 테스트. -> affectedRows = 1 : date 변해서 해당됨. + 조건에 맞으면  증가, 바뀌는지 확인은 changedRows

게시물 내용에 태그를 넣을 경우 예외 처리.

ajax 상대 주소로 변경.

게시물에 파일과 이미지 삽입 기능 추가.

### 4.0.0

password 가리기

로그인 보강 (refresh 토큰 추가)

글쓰기 작성자가 아니면 막기

alert -> dialog로 전환


## ERD

![image](https://github.com/user-attachments/assets/4e9fdcab-58e7-4e65-962c-49b84b57a40c)



## 커밋 컨벤션
- 접두사(1개만) + 한칸 띄우고 + 콜론 + 한칸 띄우고 + 내용적기
- ex) add : monsterHandler 생성

  
|작업타입|작업내용|
|------|---|
|feat|해당 파일에 새로운 기능이 생김|
|add|없던 파일을 생성함, 초기 세팅|
|bugfix|버그 수정|
|refactor|코드 리팩토링|
|fix|코드 수정|
|move|파일 옮김/정리|
|del|기능/파일을 삭제|
|test|테스트 코드를 작성|
|style|css 수정|
|gitfix|gitignore 수정|
|script|package.json 변경(npm 설치 등)|
