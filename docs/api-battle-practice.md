# 메이플스토리 연무장 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요

---

## 엔드포인트 흐름

```
1. /battle-practice/replay-id  →  replay_id 획득
2. /battle-practice/result      →  측정 결과 조회 (replay_id 사용)
3. /battle-practice/skill-timeline  →  스킬 사용 내역 조회 (replay_id 사용)
4. /battle-practice/character-info  →  입장 시 캐릭터 정보 조회 (replay_id 사용)
```

---

## 1. 연무장 리플레이 식별자 조회

**GET** `/maplestory/v1/battle-practice/replay-id`

캐릭터의 연무장 리플레이 식별자를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `ocid` | query | string | 필수 | 캐릭터 식별자 |

**응답 200:**
```json
{
  "register_date": "string (KST)",
  "replay_id": "string"
}
```

---

## 2. 연무장 측정 결과 조회

**GET** `/maplestory/v1/battle-practice/result`

연무장 측정 결과 정보를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `replay_id` | query | string | 필수 | 연무장 리플레이 식별자 |

**응답 200:**
```json
{
  "register_date": "string",
  "total_play_time": "number (밀리초)",
  "total_damage": "number",
  "total_dps": "number",
  "end_type": "string",
  "like_count": "number",
  "skill_statistic": [
    {
      "skill_name": "string",
      "skill_damage": "number",
      "skill_dps": "number",
      "skill_use_count": "number"
    }
  ]
}
```

---

## 3. 연무장 스킬 사용 내역 조회

**GET** `/maplestory/v1/battle-practice/skill-timeline`

연무장 진행 간 스킬 사용 내역을 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `replay_id` | query | string | 필수 | 연무장 리플레이 식별자 |
| `page_no` | query | number | 선택 | 페이지 번호 (기본값: 1) |

**응답 200:**
```json
{
  "page_no": "number",
  "total_page_no": "number",
  "skill_timeline": [
    {
      "time": "number (밀리초)",
      "skill_name": "string"
    }
  ]
}
```

---

## 4. 연무장 입장 시 캐릭터 정보 조회

**GET** `/maplestory/v1/battle-practice/character-info`

연무장 입장 시의 캐릭터 능력치 관련 정보를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `replay_id` | query | string | 필수 | 연무장 리플레이 식별자 |

**응답 200:**
```json
{
  "basic_object": {},
  "stat_object": {},
  "hyper_stat_object": {},
  "propensity_object": {},
  "ability_object": {},
  "item_object": {},
  "skill_object": {},
  "link_skill_object": {},
  "v_matrix_object": {},
  "hexa_matrix_object": {},
  "ring_reserve_skill_object": {},
  "union_raider_object": {},
  "union_artifact_object": {},
  "union_champion_object": {},
  "guild_object": {}
}
```

> 각 object의 내부 구조는 해당 개별 API 응답 스키마와 동일합니다.

---

## 에러 응답

| 상태 코드 | 설명 |
|----------|------|
| 400 | Bad Request — 잘못된 파라미터 |
| 403 | Forbidden — 권한 없음 |
| 429 | Too Many Requests — 요청 한도 초과 |
| 500 | Internal Server Error |
