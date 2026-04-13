# 메이플스토리 캐릭터 정보 조회 API

**Base URL:** `https://open.api.nexon.com`  
**인증:** 모든 요청에 헤더 `x-nxopen-api-key` 필요  
**데이터 기준:** 평균 15분 후 조회 가능. 전날 데이터는 다음날 오전 2시부터 조회 가능

---

## 공통 파라미터

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `x-nxopen-api-key` | header | string | 필수 | API 인증 키 |
| `ocid` | query | string | 필수 | 캐릭터 식별자 |
| `date` | query | string | 선택 | 조회 기준일 (KST, YYYY-MM-DD) |

---

## 1. 캐릭터 목록 조회

**GET** `/maplestory/v1/character/list`

계정에 속한 캐릭터 목록을 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "account_list": [
    {
      "account_id": "string",
      "character_list": [
        {
          "ocid": "string",
          "character_name": "string",
          "world_name": "string",
          "character_class": "string",
          "character_level": "number"
        }
      ]
    }
  ]
}
```

---

## 2. 캐릭터 식별자(ocid) 조회

**GET** `/maplestory/v1/id`

캐릭터 이름으로 ocid를 조회합니다.

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `character_name` | query | string | 필수 | 캐릭터 이름 |

**응답 200:**
```json
{
  "ocid": "string"
}
```

---

## 3. 기본 정보 조회

**GET** `/maplestory/v1/character/basic`

캐릭터의 기본 정보를 조회합니다. (2023-12-21부터 데이터 제공)

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "character_name": "string",
  "world_name": "string",
  "character_gender": "string",
  "character_class": "string",
  "character_class_level": "string",
  "character_level": "number",
  "character_exp": "number",
  "character_exp_rate": "string",
  "character_guild_name": "string",
  "character_image": "string (URL)",
  "character_date_create": "string",
  "access_flag": "string (최근 7일 로그인 여부)",
  "liberation_quest_clear": "string (해방 퀘스트 완료 여부)"
}
```

---

## 4. 인기도 정보 조회

**GET** `/maplestory/v1/character/popularity`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "popularity": "number"
}
```

---

## 5. 종합 능력치 정보 조회

**GET** `/maplestory/v1/character/stat`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "character_class": "string",
  "final_stat": [
    {
      "stat_name": "string",
      "stat_value": "string"
    }
  ],
  "remain_ap": "number"
}
```

---

## 6. 하이퍼스탯 정보 조회

**GET** `/maplestory/v1/character/hyper-stat`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "character_class": "string",
  "use_preset_no": "string",
  "use_available_hyper_stat": "number",
  "hyper_stat_preset_1": [
    {
      "stat_type": "string",
      "stat_point": "number",
      "stat_level": "number",
      "stat_increase": "string"
    }
  ],
  "hyper_stat_preset_1_remain_point": "number",
  "hyper_stat_preset_2": [...],
  "hyper_stat_preset_2_remain_point": "number",
  "hyper_stat_preset_3": [...],
  "hyper_stat_preset_3_remain_point": "number"
}
```

---

## 7. 성향 정보 조회

**GET** `/maplestory/v1/character/propensity`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "charisma_level": "number",
  "sensibility_level": "number",
  "insight_level": "number",
  "willingness_level": "number",
  "handicraft_level": "number",
  "charm_level": "number"
}
```

---

## 8. 어빌리티 정보 조회

**GET** `/maplestory/v1/character/ability`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "ability_grade": "string",
  "ability_info": [
    {
      "ability_no": "string",
      "ability_grade": "string",
      "ability_value": "string"
    }
  ],
  "remain_fame": "number",
  "preset_no": "number",
  "ability_preset_1": {
    "ability_preset_grade": "string",
    "ability_info": [...]
  },
  "ability_preset_2": {...},
  "ability_preset_3": {...}
}
```

---

## 9. 장착 장비 정보 조회 (캐시 장비 제외)

**GET** `/maplestory/v1/character/item-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:**
```json
{
  "date": "string",
  "character_gender": "string",
  "character_class": "string",
  "preset_no": "number",
  "item_equipment": [
    {
      "item_equipment_part": "string",
      "item_equipment_slot": "string",
      "item_name": "string",
      "item_icon": "string (URL)",
      "item_description": "string",
      "item_shape_name": "string",
      "item_shape_icon": "string",
      "item_gender": "string",
      "item_total_option": {
        "str": "string", "dex": "string", "int": "string", "luk": "string",
        "max_hp": "string", "max_mp": "string",
        "attack_power": "string", "magic_power": "string",
        "armor": "string", "speed": "string", "jump": "string",
        "boss_damage": "string", "ignore_monster_armor": "string",
        "all_stat": "string", "damage": "string",
        "equipment_level_decrease": "number",
        "max_hp_rate": "string", "max_mp_rate": "string"
      },
      "item_base_option": {...},
      "potential_option_flag": "string",
      "additional_potential_option_flag": "string",
      "potential_option_grade": "string",
      "additional_potential_option_grade": "string",
      "potential_option_1": "string",
      "potential_option_2": "string",
      "potential_option_3": "string",
      "additional_potential_option_1": "string",
      "additional_potential_option_2": "string",
      "additional_potential_option_3": "string",
      "equipment_level_increase": "number",
      "item_exceptional_option": {
        "str": "string", "dex": "string", "int": "string", "luk": "string",
        "max_hp": "string", "max_mp": "string",
        "attack_power": "string", "magic_power": "string",
        "exceptional_upgrade": "number"
      },
      "item_add_option": {...},
      "growth_exp": "number",
      "growth_level": "number",
      "scroll_upgrade": "string",
      "cuttable_count": "string",
      "golden_hammer_flag": "string",
      "scroll_resilience_count": "string",
      "scroll_upgradable_count": "string",
      "soul_name": "string",
      "soul_option": "string",
      "item_etc_option": {...},
      "starforce": "string",
      "starforce_scroll_flag": "string",
      "item_starforce_option": {...},
      "special_ring_level": "number",
      "date_expire": "string",
      "freestyle_flag": "string"
    }
  ],
  "item_equipment_preset_1": [...],
  "item_equipment_preset_2": [...],
  "item_equipment_preset_3": [...]
}
```

---

## 10. 장착 캐시 장비 정보 조회

**GET** `/maplestory/v1/character/cashitem-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 캐시 장비 목록 (item-equipment와 유사한 구조)

---

## 11. 장착 심볼 정보 조회

**GET** `/maplestory/v1/character/symbol-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 장착된 심볼 목록 및 레벨/경험치 정보

---

## 12. 적용 세트 효과 정보 조회

**GET** `/maplestory/v1/character/set-effect`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 활성화된 세트 효과 목록

---

## 13. 장착 헤어·성형·피부 정보 조회

**GET** `/maplestory/v1/character/beauty-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 헤어, 성형, 피부 장비 정보

---

## 14. 장착 안드로이드 정보 조회

**GET** `/maplestory/v1/character/android-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 안드로이드 및 안드로이드 장비 정보

---

## 15. 장착 펫 정보 조회

**GET** `/maplestory/v1/character/pet-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 펫 및 펫 장비, 펫 스킬 정보

---

## 16. 스킬 정보 조회

**GET** `/maplestory/v1/character/skill`

**파라미터:**

| 파라미터 | 위치 | 타입 | 필수 | 설명 |
|---------|------|------|------|------|
| `ocid` | query | string | 필수 | 캐릭터 식별자 |
| `date` | query | string | 선택 | 조회 기준일 |
| `character_skill_grade` | query | string | 필수 | 스킬 전직 차수 |

**`character_skill_grade` 값:**
`0`, `1`, `1.5`, `2`, `2.5`, `3`, `4`, `hyperpassive`, `hyperactive`, `5`, `6`

**응답 200:** 해당 차수의 스킬 목록 및 레벨 정보

---

## 17. 장착 링크 스킬 정보 조회

**GET** `/maplestory/v1/character/link-skill`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 링크 스킬 목록 및 레벨 정보

---

## 18. V매트릭스 정보 조회

**GET** `/maplestory/v1/character/vmatrix`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** V매트릭스 슬롯 및 V코어 정보

---

## 19. HEXA 코어 정보 조회

**GET** `/maplestory/v1/character/hexamatrix`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** HEXA 매트릭스 코어 정보

---

## 20. HEXA 매트릭스 HEXA 스탯 정보 조회

**GET** `/maplestory/v1/character/hexamatrix-stat`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 설정된 HEXA 스탯 정보

---

## 21. 무릉도장 최고 기록 정보 조회

**GET** `/maplestory/v1/character/dojang`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 무릉도장 최고 층수 및 기록 정보

---

## 22. 기타 능력치 영향 요소 정보 조회

**GET** `/maplestory/v1/character/other-stat`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 다른 엔드포인트에서 다루지 않는 스탯 영향 요소 정보

---

## 23. 링 익스체인지 스킬 등록 장비 조회

**GET** `/maplestory/v1/character/ring-exchange-skill-equipment`

> ⚠️ 2026-03-18까지 제공되는 한시적 엔드포인트

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 링 익스체인지 스킬에 등록된 장비 정보

---

## 24. 예비 특수 반지 장착 정보 조회

**GET** `/maplestory/v1/character/ring-reserve-skill-equipment`

**파라미터:** [공통 파라미터](#공통-파라미터) 참조

**응답 200:** 예비 특수 반지 슬롯 장착 정보

---

## 25. 업적 정보 조회

**GET** `/maplestory/v1/user/achievement`

계정의 업적 정보를 조회합니다.

**파라미터:** `x-nxopen-api-key` (header)만 필요

**응답 200:**
```json
{
  "account_list": [
    {
      "account_id": "string",
      "achievement_achieve": [
        {
          "achievement_name": "string",
          "achievement_description": "string"
        }
      ]
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

```json
{
  "error": {
    "name": "string",
    "message": "string"
  }
}
```
