# API

### 1. 인증 (Auth)

| **분류** | **경로** | **메서드** |
| --- | --- | --- |
| 로그인 | `/api/auth/login` | `POST` |
| 로그아웃 | `/api/auth/logout` | `POST` |
| 테스트 로그인 | `/api/auth/test-login` | `POST` |

### 2. 사용자 (User)

| **분류** | **경로** | **메서드** |
| --- | --- | --- |
| 내 정보 조회 | `/api/me` | `GET` |
| 나의 정보 조회 | `/api/my` | `GET` |
| 나의 요약 정보 | `/api/my/summary` | `GET` |
| 동의 처리 | `/api/consent` | `POST` |
| 대표 캐릭터 변경 | `/api/users/main-character` | `PATCH` |
| 설정 변경 | `/api/users/settings` | `PATCH` |

### 3. 캐릭터 (Character)

| **분류** | **경로** | **메서드** |
| --- | --- | --- |
| 캐릭터 목록 조회 | `/api/characters` | `GET` |
| 캐릭터 이미지 조회 | `/api/characters/image` | `GET` |
| 특정 캐릭터 상세/생성 | `/api/characters/[character_name]` | `GET`, `POST` |
| 특정 캐릭터 이미지 | `/api/characters/[character_name]/image` | `GET` |
| 캐릭터 히스토리 | `/api/characters/[character_name]/history` | `GET` |
| 캐릭터 조회수 증가 | `/api/characters/[character_name]/view` | `POST` |
| 외형 수정 | `/api/characters/[character_name]/appearance` | `PATCH` |
| 모션 수정 | `/api/characters/[character_name]/motion` | `PATCH` |
| 리뷰 등록 | `/api/characters/[character_name]/reviews` | `POST` |
| 초기 셋업 | `/api/setup` | `POST` |

### 4. 리뷰 및 알림 (Review & Notification)

| **분류** | **경로** | **메서드** |
| --- | --- | --- |
| 리뷰 수정/삭제 | `/api/reviews/[id]` | `PATCH`, `DELETE` |
| 리뷰 추천(투표) | `/api/reviews/[id]/vote` | `POST` |
| 리뷰 신고 | `/api/reviews/[id]/report` | `POST` |
| 알림 목록/등록/삭제 | `/api/notifications` | `GET`, `POST`, `DELETE` |
| 특정 알림 삭제 | `/api/notifications/[id]` | `DELETE` |

### 5. 길드, 랭킹 및 파일 (Etc)

| **분류** | **경로** | **메서드** |
| --- | --- | --- |
| 길드 정보 조회/등록 | `/api/guild/[world]/[name]` | `GET`, `POST` |
| 리뷰 이미지 업로드 | `/api/upload/review-image` | `POST` |
| 파일 다운로드/조회 | `/api/files/[...key]` | `GET` |
| 랭킹 조회 | `/api/rankings` | `GET` |

### 6. 관리자 (Admin)

| **분류** | **경로** | **메서드** |
| --- | --- | --- |
| 어드민 본인 확인 | `/api/admin/me` | `GET` |
| 전체 유저 관리 | `/api/admin/users` | `GET` |
| 특정 유저 상세/수정 | `/api/admin/users/[ouid]` | `GET`, `PATCH` |
| 전체 캐릭터 관리 | `/api/admin/characters` | `GET` |
| 캐릭터 삭제/복구 | `/api/admin/characters/[ocid]` | `DELETE`, `POST` |
| 전체 리뷰 관리 | `/api/admin/reviews` | `GET` |
| 특정 리뷰 삭제 | `/api/admin/reviews/[id]` | `DELETE` |
| 신고 목록 관리 | `/api/admin/reports` | `GET` |
| 특정 신고 처리 | `/api/admin/reports/[id]` | `PATCH` |
| 통계 조회 | `/api/admin/stats` | `GET` |
| 로그 조회 | `/api/admin/logs` | `GET` |
| 로그 복구 | `/api/admin/logs/[id]/revert` | `POST` |