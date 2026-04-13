# 메이플스토리 길드 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요  
**데이터 기준:** 2023-12-21부터 데이터 제공. 평균 15분 후 조회 가능

---

## 지원 월드

`스카니아`, `베라`, `루나`, `제니스`, `크로아`, `유니온`, `엘리시움`, `이노시스`, `레드`, `오로라`, `아케인`, `노바`, `에오스`, `헬리오스`, `챌린저스`, `챌린저스2`, `챌린저스3`, `챌린저스4`

> 2024-12-19부터 리부트/리부트2는 에오스/헬리오스로 대체

---

## 1. 길드 식별자(oguild_id) 조회

**GET** `/maplestory/v1/guild/id`

길드 이름과 월드 이름으로 길드 식별자를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `guild_name` | query | string | 필수 | 길드 이름 |
| `world_name` | query | string | 필수 | 월드 이름 |

**응답 200:**
```json
{
  "oguild_id": "string"
}
```

---

## 2. 길드 기본 정보 조회

**GET** `/maplestory/v1/guild/basic`

길드 식별자로 길드의 상세 정보를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `oguild_id` | query | string | 필수 | 길드 식별자 |
| `date` | query | string | 선택 | 조회 기준일 (KST, YYYY-MM-DD) |

**응답 200:**
```json
{
  "date": "string",
  "world_name": "string",
  "guild_name": "string",
  "guild_level": "number",
  "guild_fame": "number",
  "guild_point": "number",
  "guild_master_name": "string",
  "guild_member_count": "number",
  "guild_member": ["string"],
  "guild_skill": [
    {
      "skill_name": "string",
      "skill_description": "string",
      "skill_level": "number",
      "skill_effect": "string",
      "skill_icon": "string (URL)"
    }
  ],
  "guild_noblesse_skill": [
    {
      "skill_name": "string",
      "skill_description": "string",
      "skill_level": "number",
      "skill_effect": "string",
      "skill_icon": "string (URL)"
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
