/**
 * @file src/types/character.ts - 메이플스토리 캐릭터 JSON 데이터 타입 정의
 * @author Mesbul <parksehyun2024@gmail.com>
 * @description
 * NEXON Open API에서 반환되는 메이플스토리 캐릭터의 상세 정보(스탯, 장비, 스킬, 유니온 등)에 대한
 * TypeScript 인터페이스 및 타입들을 모아둔 파일입니다.
 * 이곳의 정의된 타입들은 주로 DB 스키마(schema.ts)의 JSON 컬럼 타입 단언($type<T>) 및
 * 프론트엔드 UI 렌더링, API 응답 타입 등에 재사용됩니다.
 * @copyright Copyright (c) 2026 Mesbul.
 */

/**
 * 종합 능력치 정보 타입 
 * @see NEXON Open API - /maplestory/v1/character/stat
 */
export interface StatJsonType {
  date:            string | null;
  character_class: string | null;
  final_stat:      FinalStat[];
  remain_ap:       number | null;
}

export interface FinalStat {
  stat_name:  string;
  stat_value: string;
}

/**
 * 하이퍼 스탯 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/hyper-stat
 */
export interface HyperStatJsonType {
  date:                             string | null;
  character_class:                  string | null;
  use_preset_no:                    string | null;
  use_available_hyper_stat:         number | null;
  hyper_stat_preset_1:              HyperStatPreset[] | null;
  hyper_stat_preset_1_remain_point: number;
  hyper_stat_preset_2:              HyperStatPreset[] | null;
  hyper_stat_preset_2_remain_point: number;
  hyper_stat_preset_3:              HyperStatPreset[] | null;
  hyper_stat_preset_3_remain_point: number;
}

export interface HyperStatPreset {
  stat_type:     string;
  stat_point:    number | null;
  stat_level:    number;
  stat_increase: string | null;
}

/**
 * 성향 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/propensity
 */
export interface PropensityJsonType {
  date:              string | null;
  charisma_level:    number | null;
  sensibility_level: number | null;
  insight_level:     number | null;
  willingness_level: number | null;
  handicraft_level:  number | null;
  charm_level:       number | null;
}

/**
 * 어빌리티 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/ability
 */
export interface AbilityJsonType {
  date:             string | null;
  ability_grade:    string | null;
  ability_info:     AbilityInfo[];
  remain_fame:      number | null;
  preset_no:        number | null;
  ability_preset_1: AbilityPreset | null;
  ability_preset_2: AbilityPreset | null;
  ability_preset_3: AbilityPreset | null;
}

export interface AbilityInfo {
  ability_no:    string;
  ability_grade: string;
  ability_value: string;
}

export interface AbilityPreset {
  ability_preset_grade: string;
  ability_info:         AbilityInfo[];
}

/**
 * 장착 장비 정보 (캐시 장비 제외) 타입
 * @see NEXON Open API - /maplestory/v1/character/item-equipment
 */
export interface ItemEquipmentJsonType {
  date:                    string | null;
  character_gender:        string | null;
  character_class:         string | null;
  preset_no:               number | null;
  item_equipment:          ItemEquipment[];
  item_equipment_preset_1: ItemEquipment[];
  item_equipment_preset_2: ItemEquipment[];
  item_equipment_preset_3: ItemEquipment[];
  title:                   Title | null;
  medal_shape:             string | null;
  dragon_equipment:        ItemEquipment[];
  mechanic_equipment:      ItemEquipment[];
}

export interface ItemEquipment {
  item_equipment_part:               string;
  item_equipment_slot:               string;
  item_name:                         string;
  item_icon:                         string;
  item_description:                  string | null;
  item_shape_name:                   string;
  item_shape_icon:                   string;
  item_gender:                       string | null;
  item_total_option:                 ItemAddOptionClass;
  item_base_option:                  ItemAddOptionClass;
  potential_option_grade:            PotentialOptionGrade | null;
  additional_potential_option_grade: PotentialOptionGrade | null;
  potential_option_flag:             string;
  
  potential_option_1:                string | null;
  potential_option_2:                string | null;
  potential_option_3:                string | null;
  additional_potential_option_flag:  string;
  additional_potential_option_1:     string | null;
  additional_potential_option_2:     string | null;
  additional_potential_option_3:     string | null;
  
  equipment_level_increase:          number;
  item_exceptional_option:           ItemExceptionalOption;
  item_add_option:                   ItemAddOptionClass;
  growth_exp:                        number;
  growth_level:                      number;
  scroll_upgrade:                    string;
  cuttable_count:                    string;
  
  golden_hammer_flag:                string; 
  scroll_resilience_count:           string;
  scroll_upgradeable_count:          string;
  soul_name:                         string | null;
  soul_option:                       string | null;
  item_etc_option:                   ItemEtcOptionClass;
  starforce:                         string;
  starforce_scroll_flag:             string; 
  
  item_starforce_option:             ItemEtcOptionClass;
  special_ring_level:                number;
  date_expire:                       string | null;
  freestyle_flag:                    string;
}

export type PotentialOptionGrade = "레어" | "에픽" | "유니크" | "레전드리";

export interface ItemAddOptionClass {
  str:                       string;
  dex:                       string;
  int:                       string;
  luk:                       string;
  max_hp:                    string;
  max_mp:                    string;
  attack_power:              string;
  magic_power:               string;
  armor:                     string;
  speed:                     string;
  jump:                      string;
  boss_damage:               string;
  damage?:                   string;
  all_stat:                  string;
  equipment_level_decrease?: number;
  ignore_monster_armor?:     string;
  max_hp_rate?:              string;
  max_mp_rate?:              string;
  base_equipment_level?:     number;
}

export interface ItemEtcOptionClass {
  str:          string;
  dex:          string;
  int:          string;
  luk:          string;
  max_hp:       string;
  max_mp:       string;
  attack_power: string;
  magic_power:  string;
  armor:        string;
  speed:        string;
  jump:         string;
}

export interface ItemExceptionalOption {
  str:                 string;
  dex:                 string;
  int:                 string;
  luk:                 string;
  max_hp:              string;
  max_mp:              string;
  attack_power:        string;
  magic_power:         string;
  exceptional_upgrade: number;
}

export interface Title {
  title_name:              string;
  title_icon:              string;
  title_description:       string;
  date_expire:             string | null;
  date_option_expire:      string | null;
  title_shape_name:        string | null;
  title_shape_icon:        string | null;
  title_shape_description: string | null;
}

/**
 * 장착 캐시 장비 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/cashitem-equipment
 */
export interface CashEquipmentJsonType {
  date:                                    string | null;
  character_gender:                        string | null;
  character_class:                         string | null;
  character_look_mode:                     string | null;
  preset_no:                               number | null;
  
  cash_item_equipment_base:                CashItemEquipment[];
  cash_item_equipment_preset_1:            CashItemEquipment[];
  cash_item_equipment_preset_2:            CashItemEquipment[];
  cash_item_equipment_preset_3:            CashItemEquipment[];
  
  additional_cash_item_equipment_base:     CashItemEquipment[];
  additional_cash_item_equipment_preset_1: CashItemEquipment[];
  additional_cash_item_equipment_preset_2: CashItemEquipment[];
  additional_cash_item_equipment_preset_3: CashItemEquipment[];
}

export interface CashItemEquipment {
  cash_item_equipment_part: string;
  cash_item_equipment_slot: string;
  cash_item_name:           string;
  cash_item_icon:           string;
  cash_item_description:    string | null;
  cash_item_option:         CashItemOption[];
  date_expire:              string | null;
  date_option_expire:       string | null;
  cash_item_label:          string | null;
  
  cash_item_coloring_prism: ColoringPrism | null;
  cash_item_effect_prism:   ColoringPrism | null;
  
  item_gender:              string | null;
  skills:                   string[];
  freestyle_flag:           string;
  
  emotion_name:             string | null; 
}

export interface CashItemOption {
  option_type:  string;
  option_value: string;
}

export interface ColoringPrism {
  color_range: string;
  hue:         number;
  saturation:  number;
  value:       number;
}


/**
 * 장착 심볼 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/symbol-equipment
 */
export interface SymbolJsonType {
  date:            string | null;
  character_class: string | null;
  symbol:          SymbolEquipment[];
}

export interface SymbolEquipment {
  symbol_name:                     string;
  symbol_icon:                     string;
  symbol_description:              string | null;
  
  symbol_other_effect_description: string | null; 
  
  symbol_force:                    string;
  symbol_level:                    number;
  symbol_str:                      string;
  symbol_dex:                      string;
  symbol_int:                      string;
  symbol_luk:                      string;
  symbol_hp:                       string;
  symbol_drop_rate:                string;
  symbol_meso_rate:                string;
  symbol_exp_rate:                 string;
  symbol_growth_count:             number;
  symbol_require_growth_count:     number;
}

/**
 * 적용 세트 효과 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/set-effect
 */
export interface SetEffectJsonType {
  date:       string | null;
  set_effect: SetEffect[];
}

export interface SetEffect {
  set_name:        string;
  total_set_count: number;
  
  set_effect_info: SetEffectInfo[];
  set_option_full: SetEffectInfo[];
}

export interface SetEffectInfo {
  set_count:  number;
  set_option: string;
}

/**
 * 장착 헤어, 성형, 피부 정보 타입
 * @see NEXON Open API - /maplestory/v1/character-beauty-equipment
 */
export interface BeautyEquipmentJsonType {
  date:                      string | null;
  character_gender:          string | null;
  character_class:           string | null;
  
  character_hair:            CharacterHair | null;
  character_face:            CharacterFace | null;
  character_skin:            CharacterSkin | null;
  
  additional_character_hair: CharacterHair | null;
  additional_character_face: CharacterFace | null;
  additional_character_skin: CharacterSkin | null;
}

export interface CharacterHair {
  hair_name:      string;
  base_color:     string;
  mix_color:      string | null;
  mix_rate:       string | null;
  freestyle_flag: string;
}

export interface CharacterFace {
  face_name:      string;
  base_color:     string;
  mix_color:      string | null;
  mix_rate:       string | null;
  freestyle_flag: string;
}

export interface CharacterSkin {
  skin_name:   string;
  color_style: string | null;
  
  hue:         number | null; 
  saturation:  number | null;
  brightness:  number | null;
}

/**
 * 장착 안드로이드 정보 타입
 * @see NEXON Open API - /maplestory/v1/andriod-equipment
 */
export interface AndroidEquipmentJsonType {
  date:                         string | null;
  
  android_name:                 string | null;
  android_nickname:             string | null;
  android_icon:                 string | null;
  android_description:          string | null;
  android_gender:               string | null;
  android_grade:                string | null;
  
  // 현재 적용 중인 뷰티
  android_hair:                 CharacterHair | null;
  android_face:                 CharacterFace | null;
  android_skin:                 CharacterSkin | null;
  
  android_cash_item_equipment:  AndroidCashItemEquipment[]; 
  
  android_ear_sensor_clip_flag: string | null;
  android_non_humanoid_flag:    string | null;
  android_shop_usable_flag:     string | null;
  
  preset_no:                    number | null;
  
  android_preset_1:             AndroidPreset | null;
  android_preset_2:             AndroidPreset | null;
  android_preset_3:             AndroidPreset | null;
}

export interface AndroidPreset {
  android_name:                 string | null;
  android_nickname:             string | null;
  android_icon:                 string | null;
  android_description:          string | null;
  android_gender:               string | null;
  android_grade:                string | null;
  android_skin:                 CharacterSkin | null;
  android_hair:                 CharacterHair | null;
  android_face:                 CharacterFace | null;
  android_ear_sensor_clip_flag: string | null;
  android_non_humanoid_flag:    string | null;
  android_shop_usable_flag:     string | null;
}

export interface AndroidCashItemEquipment {
  cash_item_equipment_part: string;
  cash_item_equipment_slot: string;
  cash_item_name:           string;
  cash_item_icon:           string;
  cash_item_description:    string | null;
  cash_item_option:         CashItemOption[];
  date_expire:              string | null;
  date_option_expire:       string | null;
  cash_item_label:          string | null;
  cash_item_coloring_prism: ColoringPrism | null;
  android_item_gender:      string | null;
  freestyle_flag:           string;
}

/**
 * 장착 펫 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/pet-equipment
 */
export interface PetJsonType {
    date:                  string | null;

    pet_1_name:            string | null;
    pet_1_nickname:        string | null;
    pet_1_icon:            string | null;
    pet_1_description:     string | null;
    pet_1_equipment:       PetEquipment | null;
    pet_1_auto_skill:      PetAutoSkill | null;
    pet_1_pet_type:        string | null;
    pet_1_skill:           string[];
    pet_1_date_expire:     string | null;
    pet_1_appearance:      string | null;
    pet_1_appearance_icon: string | null;

    pet_2_name:            string | null;
    pet_2_nickname:        string | null;
    pet_2_icon:            string | null;
    pet_2_description:     string | null;
    pet_2_equipment:       PetEquipment | null;
    pet_2_auto_skill:      PetAutoSkill | null;
    pet_2_pet_type:        string | null;
    pet_2_skill:           string[];
    pet_2_date_expire:     string | null;
    pet_2_appearance:      string | null;
    pet_2_appearance_icon: string | null;

    pet_3_name:            string | null;
    pet_3_nickname:        string | null;
    pet_3_icon:            string | null;
    pet_3_description:     string | null;
    pet_3_equipment:       PetEquipment | null;
    pet_3_auto_skill:      PetAutoSkill | null;
    pet_3_pet_type:        string | null;
    pet_3_skill:           string[];
    pet_3_date_expire:     string | null;
    pet_3_appearance:      string | null;
    pet_3_appearance_icon: string | null;
}

export interface PetItemOption {
    option_type:  string;
    option_value: string;
}

export interface PetEquipment {
    item_name:          string;
    item_icon:          string;
    item_description:   string | null;
    item_option:        PetItemOption[]; // 옵션이 없으면 빈 배열
    scroll_upgrade:     number;
    scroll_upgradable:  number;
    item_shape:         string;
    item_shape_icon:    string;
    // 무제한은 null, 미착용은 "-1" 문자열로 올 수 있음
    item_date_expire:   string | null; 
}

export interface PetAutoSkill {
    skill_1:      string | null;
    skill_1_icon: string | null;
    skill_2:      string | null;
    skill_2_icon: string | null;
}

/**
 * 스킬 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/skill
 */
export type SkillJsonType = SkillGradeData[];

export interface SkillGradeData {
  date:                  string | null;
  character_class:       string;
  character_skill_grade: string; 
  character_skill:       SkillInfo[]; 
}

export interface SkillInfo {
  skill_name:        string;
  skill_description: string;
  skill_level:       number;
  skill_effect:      string | null; 
  skill_effect_next: string | null; 
  skill_icon:        string;
}

/**
 * 장착 링크 스킬 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/link-skill
 */
export interface LinkSkillJsonType {
  date:                                string | null;
  character_class:                     string | null;
  
  character_link_skill:                LinkSkillInfo[];
  character_link_skill_preset_1:       LinkSkillInfo[];
  character_link_skill_preset_2:       LinkSkillInfo[];
  character_link_skill_preset_3:       LinkSkillInfo[];
  
  character_owned_link_skill:          LinkSkillInfo | null;
  character_owned_link_skill_preset_1: LinkSkillInfo | null;
  character_owned_link_skill_preset_2: LinkSkillInfo | null;
  character_owned_link_skill_preset_3: LinkSkillInfo | null;
}

export interface LinkSkillInfo {
  skill_name:        string;
  skill_description: string;
  skill_level:       number;
  skill_effect:      string;
  
  skill_effect_next?: string | null; 
  
  skill_icon:        string;
}

/**
 * V매트릭스 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/vmatrix
 */

export interface VMatrixJsonType {
  date:                                         string | null;
  character_class:                              string | null;
  character_v_core_equipment:                   VCoreEquipment[];
  character_v_matrix_remain_slot_upgrade_point: number;
}

export interface VCoreEquipment {
  slot_id:      string;
  
  /**
   * @deprecated 2025년 12월 18일 점검 이후부터 사용하지 않는 항목입니다. (0으로 응답됨)
   */
  slot_level:   number;
  
  v_core_name:  string;
  v_core_type:  string;
  v_core_level: number;
  
  /**
   * @deprecated 2025년 12월 18일 점검 이후부터 사용하지 않는 항목입니다. (null로 응답됨)
   */
  v_core_skill_1: string | null;
  
  /**
   * @deprecated 2025년 12월 18일 점검 이후부터 사용하지 않는 항목입니다. (null로 응답됨)
   */
  v_core_skill_2: string | null;
  
  /**
   * @deprecated 2025년 12월 18일 점검 이후부터 사용하지 않는 항목입니다. (null로 응답됨)
   */
  v_core_skill_3: string | null;
}

/**
 * HEXA 코어 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/hexamatrix
 */
export interface HexaMatrixJsonType {
    date:                         string | null;
    
    character_hexa_core_equipment: HexaCoreEquipment[];
}

export interface HexaCoreEquipment {
    hexa_core_name:  string;
    hexa_core_level: number;
    hexa_core_type:  string;
    
    linked_skill:    LinkedHexaSkill[];
}

export interface LinkedHexaSkill {
    hexa_skill_id: string;
}

/**
 * HEXA 매트릭스 설정 HEXA 스탯 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/hexamatrix-stat
 */
export interface HexaStatJsonType {
    date:                   string | null;
    character_class:        string | null;
    
    character_hexa_stat_core:   HexaStatCore[];
    character_hexa_stat_core_2: HexaStatCore[];
    character_hexa_stat_core_3: HexaStatCore[];
    
    preset_hexa_stat_core:      HexaStatCore[];
    preset_hexa_stat_core_2:    HexaStatCore[];
    preset_hexa_stat_core_3:    HexaStatCore[];
}

export interface HexaStatCore {
    slot_id:            string;
    
    main_stat_name:     string;
    sub_stat_name_1:    string;
    sub_stat_name_2:    string;
    
    main_stat_level:    number;
    sub_stat_level_1:   number;
    sub_stat_level_2:   number;
    
    stat_grade:         number;
}

/**
 * 무릉도장 최고 기록 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/dojang
 */
export interface DojangJsonType {
  date:               string | null;
  character_class:    string | null;
  world_name:         string | null;
  dojang_best_floot:  number | null;
  date_dojang_record: string | null;
  dojang_best_time:   number | null;
}

/**
 * 기타 능력치 영향 요소 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/other-stat
 */
export interface OtherJsonType {
  date:       string | null;
  other_stat: OtherStatType[];
}

export interface OtherStatType {
  other_stat_type: string;
  stat_info:       OtherStat[];
}

export interface OtherStat {
  stat_name:  string;
  stat_value: string;
}

/**
 * 예비 특수 반지 장착 정보 타입
 * @see NEXON Open API - /maplestory/v1/character/ring-reserve-skill-equipment
 */
export interface RingReserveSkillEquipmentJsonType {
  date:                             string | null;
  character_class:                  string | null;
  special_ring_reserve_name:        string | null;
  special_ring_reserve_level:       number | null;
  special_ring_reserve_icon:        string | null;
  special_ring_reserve_description: string | null;
}