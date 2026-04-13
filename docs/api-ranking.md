# 메이플스토리 랭킹 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요  
**데이터 기준:** 2023-12-22부터 데이터 제공. 일별 랭킹은 매일 오전 9시경 갱신

---

## 공통 파라미터

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `date` | query | string | 필수 | 조회 기준일 (KST, YYYY-MM-DD) |

---

## 지원 월드

`스카니아`, `베라`, `루나`, `제니스`, `크로아`, `유니온`, `엘리시움`, `이노시스`, `레드`, `오로라`, `아케인`, `노바`, `에오스`, `헬리오스`, `챌린저스`, `챌린저스2`, `챌린저스3`, `챌린저스4`

> 2024-12-19부터 리부트/리부트2는 에오스/헬리오스로 30일간 리다이렉트 후 전환

---

## 1. 종합 랭킹 조회

**GET** `/maplestory/v1/ranking/overall`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `date` | query | string | 필수 | 조회 기준일 |
| `world_name` | query | string | 선택 | 월드 이름 |
| `world_type` | query | number | 선택 | 월드 타입 (0: 일반, 1: 리부트 계열) |
| `class` | query | string | 선택 | 직업 |
| `ocid` | query | string | 선택 | 캐릭터 식별자 |
| `page` | query | number | 선택 | 페이지 번호 |

**응답 200:**
```json
{
  "ranking": [
    {
      "date": "string",
      "ranking": "number",
      "character_name": "string",
      "world_name": "string",
      "class_name": "string",
      "sub_class_name": "string",
      "character_level": "number",
      "character_exp": "number",
      "character_popularity": "number",
      "character_guildname": "string"
    }
  ]
}
```

---

## 2. 유니온 랭킹 조회

**GET** `/maplestory/v1/ranking/union`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `date` | query | string | 필수 | 조회 기준일 |
| `world_name` | query | string | 선택 | 월드 이름 |
| `ocid` | query | string | 선택 | 캐릭터 식별자 |
| `page` | query | number | 선택 | 페이지 번호 |

**응답 200:**
```json
{
  "ranking": [
    {
      "date": "string",
      "ranking": "number",
      "character_name": "string",
      "world_name": "string",
      "class_name": "string",
      "sub_class_name": "string",
      "union_level": "number",
      "union_power": "number"
    }
  ]
}
```

---

## 3. 길드 랭킹 조회

**GET** `/maplestory/v1/ranking/guild`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `date` | query | string | 필수 | 조회 기준일 |
| `world_name` | query | string | 선택 | 월드 이름 |
| `ranking_type` | query | number | 필수 | 랭킹 종류 (0: 주간 명성치, 1: 플래그레이스, 2: 지하수로) |
| `guild_name` | query | string | 선택 | 길드 이름 |
| `page` | query | number | 선택 | 페이지 번호 |

**응답 200:**
```json
{
  "ranking": [
    {
      "date": "string",
      "ranking": "number",
      "guild_name": "string",
      "world_name": "string",
      "guild_level": "number",
      "guild_master_name": "string",
      "guild_mark": "string",
      "guild_point": "number"
    }
  ]
}
```

---

## 4. 무릉도장 랭킹 조회

**GET** `/maplestory/v1/ranking/dojang`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `date` | query | string | 필수 | 조회 기준일 |
| `world_name` | query | string | 선택 | 월드 이름 |
| `difficulty` | query | number | 필수 | 구분 (0: 일반, 1: 마스터) |
| `class` | query | string | 선택 | 직업 |
| `ocid` | query | string | 선택 | 캐릭터 식별자 |
| `page` | query | number | 선택 | 페이지 번호 |

**응답 200:**
```json
{
  "ranking": [
    {
      "date": "string",
      "ranking": "number",
      "character_name": "string",
      "world_name": "string",
      "class_name": "string",
      "sub_class_name": "string",
      "character_level": "number",
      "dojang_floor": "number",
      "dojang_time_record": "number (초)"
    }
  ]
}
```

---

## 5. 더 시드 랭킹 조회

**GET** `/maplestory/v1/ranking/theseed`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `date` | query | string | 필수 | 조회 기준일 |
| `world_name` | query | string | 선택 | 월드 이름 |
| `ocid` | query | string | 선택 | 캐릭터 식별자 |
| `page` | query | number | 선택 | 페이지 번호 |

**응답 200:**
```json
{
  "ranking": [
    {
      "date": "string",
      "ranking": "number",
      "character_name": "string",
      "world_name": "string",
      "class_name": "string",
      "sub_class_name": "string",
      "character_level": "number",
      "theseed_floor": "number",
      "theseed_time_record": "number (초)"
    }
  ]
}
```

---

## 6. 업적 랭킹 조회

**GET** `/maplestory/v1/ranking/achievement`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `date` | query | string | 필수 | 조회 기준일 |
| `ocid` | query | string | 선택 | 캐릭터 식별자 |
| `page` | query | number | 선택 | 페이지 번호 |

**응답 200:**
```json
{
  "ranking": [
    {
      "date": "string",
      "ranking": "number",
      "character_name": "string",
      "world_name": "string",
      "class_name": "string",
      "sub_class_name": "string",
      "trophy_grade": "string",
      "trophy_score": "number"
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
