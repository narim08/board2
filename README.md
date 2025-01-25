# [게시판 웹 사이트]


## 기간

2025.01.23: 도메인 설계, API 명세서 작성

2025.01.24: 코드 작성, 구현 완료

2025.01.25: 서버 배포(cloudTypd)
https://port-0-board2-m6bsa1pbd9e6e428.sel4.cloudtype.app



---

## 목적

CRUD 공부

---

## 기능

게시판-생성, 조회(전체는 5개씩 페이징 / 단일 / 제목 검색), 수정, 삭제

댓글-생성, 조회(전체), 수정, 삭제

Rest api로 통신하도록 구성


---

## ERD

![스크린샷 2025-01-23 194412](https://github.com/user-attachments/assets/b97ef624-ab8d-4d2c-8f96-ce5902e8ecbd)


---

## API 명세서

![스크린샷 2025-01-24 212321](https://github.com/user-attachments/assets/2338801f-4b01-47de-9165-a73ec1e2e504)


---


## 화면 구성

### 1. 게시글 전체 조회(메인 페이지)

최신 글이 상단에 나타나며, 게시글은 5개씩 페이징 되어 출력된다. 

![스크린샷 2025-01-24 205140](https://github.com/user-attachments/assets/4261a244-2f10-4b7a-879a-83e8f0a2393b)


제목으로 검색하면 해당 문자가 포함된 글들이 나온다. 빈칸으로 검색시 전체 목록이 그대로 출력된다.

![스크린샷 2025-01-24 205833](https://github.com/user-attachments/assets/db0bffe6-4d89-4cf8-8870-7b96c85aa255)





### 2. 게시글 작성

제목, 작성자, 내용을 입력할 수 있다.(Not NULL) 완료하거나 취소하면 메인 페이지로 돌아간다.

![스크린샷 2025-01-24 205723](https://github.com/user-attachments/assets/3bc27f89-d78f-44d1-a96b-be53072bb908)




### 3. 게시글 상세 조회

제목, 작성자, 내용, 생성일, 수정일(날짜는 자동 생성), 댓글 목록을 조회할 수 있다.

![스크린샷 2025-01-24 210039](https://github.com/user-attachments/assets/40651dc5-b17b-4b7b-b993-c0f0f70119bc)




### 4. 게시글 수정

기존에 저장되어 있는 내용을 가져와서 수정할 수 있다. 작성자, 날짜 제외 제목과 내용만 수정 가능하다. 수정 완료나 취소 시 상세 조회 화면으로 돌아간다.

![스크린샷 2025-01-24 210216](https://github.com/user-attachments/assets/8d702e23-1bb8-4bfe-b2be-566ce0c275a8)


수정 후 (제목, 내용, 수정일 업데이트)

![스크린샷 2025-01-24 210346](https://github.com/user-attachments/assets/623a1929-814f-4975-918e-dc6848bfd8ee)




### 5. 게시글 삭제

삭제 버튼을 누르면 경고 알림창이 나타나고, 확인할 시 삭제되면서 메인 페이지로 돌아간다.

![스크린샷 2025-01-24 210414](https://github.com/user-attachments/assets/744dd3d5-8c9b-4255-b5f2-64ccb5da79a4)



---



### 1. 댓글 생성 & 댓글 전체 조회

특정 게시판에 댓글을 생성하면 먼저 생성한 순으로 나열된다.(게시판과 반대) 작성자, 내용, 생성일, 수정일이 나타난다.

![스크린샷 2025-01-24 210720](https://github.com/user-attachments/assets/e0e03c0b-4f94-4d2d-b7b6-cc7715e2948a)




### 2. 댓글 수정

각 댓글마다 있는 수정 버튼으로 작성자 제외, 내용만 수정할 수 있다.

![스크린샷 2025-01-24 210831](https://github.com/user-attachments/assets/3653bfc3-c660-4082-a020-68e010b201b9)


수정 후(내용, 수정일 업데이트)

![스크린샷 2025-01-24 210912](https://github.com/user-attachments/assets/a7541905-e220-498c-9b22-05fe640b6a63)



### 3. 댓글 삭제

삭제 버튼을 선택 시 게시판과 마찬가지로 경고 알림이 뜬다. 확인하면 삭제된다.

![스크린샷 2025-01-24 210954](https://github.com/user-attachments/assets/f5f95038-3664-4a45-a53a-3bb1dc64bbf7)


삭제 후

![스크린샷 2025-01-24 211031](https://github.com/user-attachments/assets/4c0d51b3-caf1-4e42-b471-5be78a687ef0)


