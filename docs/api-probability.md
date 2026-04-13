# 메이플스토리 확률 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요  
**페이지네이션:** `cursor` 기반 (cursor 없으면 최신부터, 있으면 다음 페이지)

---

## 1. 계정 식별자(ouid) 조회 (레거시)

**GET** `/maplestory/legacy/ouid`

레거시 API 키를 사용한 계정 식별자 조회.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "ouid": "string"
}
```

---

## 2. 계정 식별자(ouid) 조회

**GET** `/maplestory/v1/ouid`

계정 식별자(ouid)를 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "ouid": "string"
}
```

---

## 3. 스타포스 강화 결과 조회

**GET** `/maplestory/v1/history/starforce`

스타포스 강화 결과를 조회합니다. (2023-12-27부터 데이터 제공, 2년 단위 롤링)

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `count` | query | string | 필수 | 조회 건수 (최소 10, 최대 1000) |
| `date` | query | string | 선택 | 조회 기준일 (KST, YYYY-MM-DD) |
| `cursor` | query | string | 선택 | 페이지네이션 커서 |

**응답 200:**
```json
{
  "count": "number",
  "next_cursor": "string",
  "starforce_history": [
    {
      "id": "string",
      "item_upgrade_result": "string",
      "before_starforce_count": "number",
      "after_starforce_count": "number",
      "starcatch_result": "string",
      "superior_item_flag": "string",
      "destroy_defence": "string",
      "chance_time": "string",
      "event_field_flag": "string",
      "upgrade_item": "string",
      "protect_shield": "string",
      "bonus_stat_upgrade": "string",
      "character_name": "string",
      "world_name": "string",
      "target_item": "string",
      "date_create": "string (KST)",
      "starforce_event_list": [...]
    }
  ]
}
```

---

## 4. 잠재능력 재설정 이용 결과 조회

**GET** `/maplestory/v1/history/potential`

잠재능력 재설정 이용 결과를 조회합니다. (2024-01-25부터 데이터 제공)

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `count` | query | number | 필수 | 조회 건수 (최소 10, 최대 1000) |
| `date` | query | string | 선택 | 조회 기준일 (KST, YYYY-MM-DD) |
| `cursor` | query | string | 선택 | 페이지네이션 커서 |

**응답 200:**
```json
{
  "count": "number",
  "next_cursor": "string",
  "potential_history": [
    {
      "id": "string",
      "character_name": "string",
      "date_create": "string (KST)",
      "potential_type": "string",
      "item_upgrade_result": "string",
      "miracle_time_flag": "string",
      "item_equipment_part": "string",
      "item_level": "number",
      "target_item": "string",
      "potential_option_grade": "string",
      "additional_potential_option_grade": "string",
      "upgrade_guarantee": "string",
      "upgrade_guarantee_count": "number",
      "before_potential_option": [
        { "value": "string", "grade": "string" }
      ],
      "before_additional_potential_option": [...],
      "after_potential_option": [...],
      "after_additional_potential_option": [...]
    }
  ]
}
```

---

## 5. 큐브 이용 결과 조회

**GET** `/maplestory/v1/history/cube`

큐브 이용 결과를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `count` | query | number | 필수 | 조회 건수 (최소 10, 최대 1000) |
| `date` | query | string | 선택 | 조회 기준일 (KST, YYYY-MM-DD) |
| `cursor` | query | string | 선택 | 페이지네이션 커서 |

**응답 200:**
```json
{
  "count": "number",
  "next_cursor": "string",
  "cube_history": [
    {
      "id": "string",
      "character_name": "string",
      "date_create": "string (KST)",
      "cube_type": "string",
      "item_upgrade_result": "string",
      "miracle_time_flag": "string",
      "item_equipment_part": "string",
      "item_level": "number",
      "target_item": "string",
      "potential_option_grade": "string",
      "additional_potential_option_grade": "string",
      "upgrade_guarantee": "string",
      "upgrade_guarantee_count": "number",
      "before_potential_option": [
        { "value": "string", "grade": "string" }
      ],
      "before_additional_potential_option": [...],
      "after_potential_option": [...],
      "after_additional_potential_option": [...]
    }
  ]
}
```

---

## 에러 응답

| 상태 코드 | 설명 |
|----------|------|
| 400 | Bad Request — 잘못된 파라미터 |
| 403 | Forbidden — 권한 없음 |
| 429 | Too Many Requests — 요청 한도 초과 |
| 500 | Internal Server Error |
