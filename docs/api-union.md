# 메이플스토리 유니온 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요  
**데이터 기준:** 2023-12-21부터 데이터 제공. 평균 15분 후 조회 가능

---

## 공통 파라미터

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `ocid` | query | string | 필수 | 캐릭터 식별자 |
| `date` | query | string | 선택 | 조회 기준일 (KST, YYYY-MM-DD) |

---

## 1. 유니온 정보 조회

**GET** `/maplestory/v1/user/union`

유니온 레벨 및 유니온 등급 정보를 조회합니다.

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "union_level": "number",
  "union_grade": "string",
  "union_artifact_level": "number",
  "union_artifact_exp": "number",
  "union_artifact_point": "number"
}
```

---

## 2. 유니온 공격대 정보 조회

**GET** `/maplestory/v1/user/union-raider`

유니온에 배치된 공격대원 효과 및 공격대 점령 효과 등 상세 정보를 조회합니다.

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "union_raider_stat": ["string"],
  "union_occupied_stat": ["string"],
  "union_inner_stat": [
    {
      "stat_field_id": "string",
      "stat_field_effect": "string"
    }
  ],
  "union_block": [
    {
      "block_type": "string",
      "block_class": "string",
      "block_level": "string",
      "block_control_point": {
        "x": "number",
        "y": "number"
      },
      "block_position": [
        { "x": "number", "y": "number" }
      ]
    }
  ],
  "use_preset_no": "number",
  "union_raider_preset_1": {...},
  "union_raider_preset_2": {...},
  "union_raider_preset_3": {...},
  "union_raider_preset_4": {...},
  "union_raider_preset_5": {...}
}
```

---

## 3. 유니온 아티팩트 정보 조회

**GET** `/maplestory/v1/user/union-artifact`

유니온 아티팩트 정보를 조회합니다. (2024-01-18부터 데이터 제공)

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "union_artifact_effect": [
    {
      "name": "string",
      "level": "number"
    }
  ],
  "union_artifact_crystal": [
    {
      "name": "string",
      "validity_flag": "string",
      "date_expire": "string",
      "level": "number",
      "crystal_option_name_1": "string",
      "crystal_option_name_2": "string",
      "crystal_option_name_3": "string"
    }
  ],
  "union_artifact_remain_ap": "number"
}
```

---

## 4. 유니온 챔피언 정보 조회

**GET** `/maplestory/v1/user/union-champion`

유니온 챔피언 정보를 조회합니다. (2025-02-20부터 데이터 제공)

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "union_champion": [
    {
      "champion_name": "string",
      "champion_slot": "string",
      "champion_grade": "string",
      "champion_class": "string",
      "champion_badge_info": [
        {
          "badge_stat": "string"
        }
      ]
    }
  ],
  "champion_badge_total_info": [
    {
      "stat_description": "string"
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
