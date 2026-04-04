# MapleBook Database Schema

### Users

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 사용자 ID | - |
| ouid | ouid | Text | Not Null, Unique | - | 사용자 OUID | - |
| role | role | Enum 또는 Text | Not Null, Default: ‘user’ | - | 사용자 역활 | user, admin 중 하나 |
| isBanned | is_banned | Boolean | Not Null, Default: false | - | 사용자 벤 여부 | - |
| banReason | ban_reason | Text | - | - | 사용자 벤 이유 | - |
| mainCharacterId | main_character_id | Int | - | characters.id | 사용자 대표 캐릭터 ID (265+) | - |
| createdAt | created_at | Text | Not Null | - | 사용자 생성 일시 | - |
| updatedAt | updated_at | Text | - | - | 사용자 정보 수정 일시 | - |

### Characters

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 캐릭터 ID | - |
| ocid | ocid | Text | Not Null, Unique | - | 캐릭터의 OCID | - |
| userId | user_id | Int | - | users.id | 캐릭터의 사용자 ID | - |
| characterName | character_name | Text | Not Null | - | 캐릭터 이름 | - |
| worldName | world_name | Text | Not Null | - | 캐릭터 월드 이름 | 스카니아, 베라 등 (한글 저장) |
| characterClass | character_class | Text | Not Null | - | 캐릭터 직업 이름 | 히어로, 팔라딘 딩 (한글 저장) |
| characterClassLevel | character_class_level | Real | - | - | 캐릭터 전직 차수 | API 문자열을 숫자로 변환 후 저장 (”1.5” → 1.5) |
| characterLevel | character_level | Int | Not Null | - | 캐릭터 레벨 | - |
| characterExp | character_exp | Int | Not Null, Default: 0 | - | 캐릭터 경험치 | 총 경험치 |
| characterExpRate | character_exp_rate | Real | Not Null, Default: 0 | - | 캐릭터 경험치 % | API 문자열을 숫자로 변환 후 저장 (”50.125%” → 50.125) |
| characterDateCreate | character_date_create | Text | - | - | 캐릭터 생성일 | - |
| characterGuildName | character_guild_name | Text | - | - | 캐릭터 길드명 | - |
| characterGuildId | character_guild_id | Int | - | guilds.id | 캐릭터 길드 ID | - |
| characterImage | character_image | Text | - | - | 캐릭터 이미지 URL | - |
| accessFlag | access_flag | Boolean | Not Null, Default: false | - | 최근 7일간 접속 기록 | true → 접속 false → 미접속 |
| popularity | popularity | Int | Not Null, Default: 0 | - | 캐릭터 인기도 |  |
| combatPower | combat_power | Int | Not Null, Default: 0 | - | 캐릭터 전투력 | API 문자열을 숫자로 변환 후 저장 ("482215247” → 482215247) |
| unionLevel | union_level | Int | Not Null, Default: 0 | - | 캐릭터 유니온 레벨 | - |
| unionGrade | union_grade | Text | - | - | 캐릭터 유니온 등급 | - |
| statJson | stat_json | Json (Text) | - | - | 캐릭터 스탯 | - |
| hyperStatJson | hyper_stat_json | Json (Text) | - | - | 캐릭터 하이퍼 스탯 | - |
| abilityJson | ability_json | Json (Text) | - | - | 캐릭터 어빌리티 | - |
| equipmentJson | equipment_json | Json (Text) | - | - | 캐릭터 장착 장비 (캐시 장비 제외) | - |
| symbolJson | symbol_json | Json (Text) | - | - | 캐릭터 장착 심볼 | - |
| cashEquipmentJson | cash_equipment_json | Json (Text) | - | - | 캐릭터 장착 캐시 장비 | - |
| androidJson | android_json | Json (Text) | - | - | 캐릭터 장착 안드로이드 | - |
| petJson | pet_json | Json (Text) | - | - | 캐릭터 장착 펫 | - |
| skillJson | skill_json | Json (Text) | - | - | 캐릭터 스킬 | - |
| vmatrixJson | vmatrix_json | Json (Text) | - | - | 캐릭터 V 메트릭스 | - |
| hexamatrixJson | hexamatrix_json | Json (Text) | - | - | 캐릭터 Hexa 메트릭스 | - |
| defaultSettings | default_settings | Json (Text) | - | - | 캐릭터 이미지 동작, 배경, 테마, 플립 설정 | - |
| bio | bio | Text | - | - | 캐릭터 자기소개 | - |
| syncedAt | synced_at | Text | - | - | 마지막 API 동기화 일시 | - |
| createdAt | created_at | Text | - | - | 레코드 생성 일시 | - |
| isIncomplete | is_incomplete | Boolean | Not Null,
Default: true | - | 기본 정보만 있고 상세 정보는 없는 상태인지 체크 | - |

### CharacterSnapshots

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 캐릭터 스냅샷 ID | - |
| ocid | ocid | Text | Not Null | - | 캐릭터 OCID | - |
| snapshotData | snapshot_data | Json (Text) | Not Null | - | 캐릭터 스냅샷 정보 | - |
| createdAt | created_at | Text | Not Null | - | 스냅샷 생성일시 | - |
| snapshotDate | snapshotDate | Text | Not Null | - | 스냅샷 일시 | - |

### Guilds

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 길드 ID | - |
| oguildId | oguild_id | Text | Not Null | - | 길드 OGUILD ID | - |
| worldName | world_name | Text | Not Null | - | 길드 월드 이름 | 스카니아, 베라 등 (한글 저장) |
| guildName | guild_name | Text | Not Null | - | 길드 이름 | - |
| guildLevel | guild_level | Int | Not Null, Default: 0 | - | 길드 레벨 | - |
| guildFame | guild_fame | Int | Not Null, Default: 0 | - | 길드 명성치 | - |
| guildMasterId | guild_master_id | Int | Not Null | characters.id | 길드 마스터 ID | - |
| guildMemberCount | guild_member_count | Int | Not Null | - | 길드 멤버 수 | - |
| guildSkillJson | guild_skill_json | Json (Text) | - | - | 길드 스킬 | - |
| noblesseSkillJson | noblesse_skill_json | Json (Text) | - | - | 길드 노블레스 스킬 | - |
| syncedAt | synced_at | Text | Not Null | - | 마지막 API 동기화 일시 | - |
| createdAt | created_at | Text | Not Null | - | 길드 컬럼 생성 일시 | - |

### Reviews

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 리뷰 ID | - |
| reviewerId | reviewer_id | Int | Not Null | users.id | 리뷰 작성자 ID | - |
| targetId | target_id | Int | Not Null | characters.id | 리뷰 달린 캐릭터 ID | - |
| mannerScore | manner_score | Int | Not Null | - | 리뷰 점수 | 1~5점 범위 |
| content | content | Text | - | - | 리뷰 내용 | - |
| images | images | Text | - | - | 리뷰 이미지 주소 | - |
| createdAt | created_at | Text | Not Null | - | 리뷰 생성 일시 | - |
| updatedAt | updated_at | Text | Not Null | - | 리뷰 수정 일시 | - |
| deletedAt | deleted_at | Text | - | - | 리뷰 삭제 일시 | - |

### ReviewVotes

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 리뷰 투표 ID | - |
| reviewId | review_id | Int | Not Null | reviews.id | 리뷰 ID | - |
| voterId | voter_id | Int | Not Null | users.id | 투표자  ID | - |
| vote | vote | Int | Not Null | - | 투표 점수 | 1 → 추천 -1 → 비추천 |
| createdAt | created_at | Text | Not Null | - | 투표 생성 일시 | - |
| updatedAt | updated_at | Text | Not Null | - | 투표 수정 일시 | - |

### ReviewReports

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 신고 ID | - |
| reporterId | reporter_id | Int | Not Null | users.id | 신고자 ID | - |
| reviewId | review_id | Int | Not Null | reviews.id | 신고 리뷰 ID | - |
| reason | reason | Text | Not Null | - | 신고 사유 | “스팸”, “욕설/비하”, “허위 정보”, “기타” |
| comment | comment | Text | - | - | 추가 설명 | - |
| status | status | Text | Not Null | - | 처리 상태 | “pending”, “resolved”, “dismissed” |
| resolvedAt | resolved_at | Text | Not Null | - | 처리 완료 일시 | - |
| createdAt | created_at | Text | Not Null | - | 신고 일시 | - |

### VisitorLogs

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| characterId | character_id | Int | PK 1 | characters.id | 캐릭터 ID | - |
| day | day | Text | PK 2 | - | 방문 날짜 | - |
| identifier | identifier | Text | PK 3 | - | 사용자 ID 또는 IP | - |

### ViewCounts

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| characterId | character_id | Int | PK 1 | characters.id | 캐릭터 ID | - |
| periodType | period_type | Text | PK 2 | - | 집계 기간 타입 | “daily”, “weekly”, “total” |
| periodKey | period_key | Text | PK 3 |  | 집계 기간 키 | “2026-04-03”, “2026-W14”, “all” |
| count | count | Int | - | - | 조회수 | - |

### Notifications

| **Field Name** | **DB Column** | **Data Type** | **Constraints** | **References** | Description |  |
| --- | --- | --- | --- | --- | --- | --- |
| id | id | Int | PK, AutoInc | - | 알림 ID | - |
| userId | user_id | Int | - | users.id | 수신자 ID | - |
| type | type | Text | Not Null, Default: “review” | - | 알림 유형 | “review”, “notices” |
| title | title | Text | Not Null | - | 알림 제목 | - |
| body | body | Text | - | - | 알림 내용 | - |
| link | link | Text | - | - | 클릭 시 이동할 링크 | - |
| isRead | is_read | Boolean | Not Null, Default: false | - | 읽음 여부 | true → 읽음 false → 안읽음 |
| createdAt | created_at | Text | Not Null | - | 알람 생성 일시 | - |