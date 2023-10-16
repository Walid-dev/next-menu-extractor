// types/MenuData.ts

export interface PropertyTier {
  price: string | number;
}

export interface Modifier {
  name: string;
  backend_name: string;
  description: string;
  price: number;
  type: string;
  plu: string;
  plu_left: string;
  plu_right: string;
  plu_remove: string;
  ignores_free_credit: boolean;
  product_plu_override: boolean;
  size_tiers: null | any[];
  property_tiers: PropertyTier[];
  tags: string[];
  image_id: number;
  metadata: any[];
  sync_tag: null | string;
  date_updated: null | string;
  size_prices: any[];
  credit_limit_override: boolean;
}

// Define types for modifier groups.
export interface ModifierGroup {
  name: string;
  backend_name: string;
  type: string;
  free_modifier_credit: number;
  selection_requirement: number;
  selection_limit: number;
  product_modifier_selection_limit_override: boolean;
  tags: string[];
  metadata: any[];
  sync_tag: null | string;
  pricing_strategy: string;
  date_updated: null | string;
  modifiers: string[];
  products: any[]; // May need to refine this type based on actual data structure
}

// Define types for individual product items in the menu.
export interface Product {
  name: string;
  backend_name: string;
  description: string;
  image_id: number;
  plu: string;
  ignores_free_credit: boolean;
  price: number;
  display_price: string;
  allow_comment: boolean;
  modifier_selection_limit: number;
  free_modifier_credit: number;
  modifier_credit_limit: null | number;
  property_tiers: PropertyTier[];
  tags: string[];
  metadata: any[];
  sync_tag: null | string;
  date_updated: string;
  modifier_groups: string[];
  modifiers: string[];
  size_modifier_credit_limit: any[]; // May need to refine this type based on actual data structure
}

// Define types for categories.
export interface Category {
  name: string;
  backend_name: string;
  description: string;
  image_id: number;
  tags: string[];
  metadata: any[];
  sync_tag: null | string;
  date_updated: string;
  products: string[];
}

// Define types for menus.
export interface Menu {
  name: string;
  backend_name: string;
  description: string;
  metadata: any[];
  tags: string[];
  sync_tag: null | string;
  date_updated: string;
  date_update_checked: null | string;
  categories: string[];
}

export interface MenuData {
  menus: Menu[];
  categories: Category[];
  products: Product[];
  modifier_groups: ModifierGroup[];
  modifiers: Modifier[];
}
