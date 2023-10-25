import { Menu, MenuData, Product, Category, ModifierGroup, Modifier, PropertyTier } from "@/types/MenuData";

export const INITIAL_DATA_MENU_STATE: MenuData = {
  menus: [],
  categories: [],
  products: [],
  modifier_groups: [],
  modifiers: [],
};

export const INITIAL_SINGLE_MENU_STATE: Menu = {
  name: "",
  backend_name: "",
  description: "",
  metadata: [],
  tags: [],
  sync_tag: null,
  date_updated: null,
  date_update_checked: null,
  categories: [],
};

export const INITIAL_CATEGORY_STATE: Category = {
  name: "",
  backend_name: "",
  description: "",
  image_id: 0,
  tags: [],
  metadata: [],
  sync_tag: null,
  date_updated: null,
  products: [],
};

export const INITIAL_PRODUCT_STATE: Product = {
  name: "",
  backend_name: "",
  description: "",
  image_id: 0,
  plu: "",
  ignores_free_credit: false,
  price: 0,
  display_price: "",
  allow_comment: false,
  modifier_selection_limit: 0,
  free_modifier_credit: 0,
  modifier_credit_limit: null,
  property_tiers: [{ price: "" }, { price: "" }, { price: "" }, { price: "" }, { price: "" }],
  tags: [],
  metadata: [],
  sync_tag: null,
  date_updated: null,
  modifier_groups: [],
  modifiers: [],
  size_modifier_credit_limit: [],
};

export const INITIAL_MODIFIER_GROUP_STATE: ModifierGroup = {
  name: "",
  backend_name: "",
  type: "",
  free_modifier_credit: 0,
  selection_requirement: 0,
  selection_limit: 0,
  product_modifier_selection_limit_override: false,
  tags: [],
  metadata: [],
  sync_tag: null,
  pricing_strategy: "",
  date_updated: null,
  modifiers: [],
  products: [],
};

export const INITIAL_MODIFIER_STATE: Modifier = {
  name: "",
  backend_name: "",
  description: "",
  price: 0,
  type: "",
  plu: "",
  plu_left: "",
  plu_right: "",
  plu_remove: "",
  ignores_free_credit: false,
  product_plu_override: false,
  size_tiers: [],
  property_tiers: [{ price: "" }, { price: "" }, { price: "" }, { price: "" }, { price: "" }],
  tags: [],
  image_id: 0,
  metadata: [],
  sync_tag: null,
  date_updated: null,
  size_prices: [],
  credit_limit_override: false,
};

export const INITIAL_MENU_STATE = {
  menus: [
    {
      name: "",
      backend_name: "",
      description: "",
      metadata: [],
      tags: [],
      sync_tag: null,
      date_updated: null,
      date_update_checked: null,
      categories: [],
    },
  ],
  categories: [
    {
      name: "",
      backend_name: "",
      description: "",
      image_id: 0,
      tags: [],
      metadata: [],
      sync_tag: null,
      date_updated: null,
      products: [],
    },
  ],
  products: [
    {
      name: "",
      backend_name: "",
      description: "",
      image_id: 0,
      plu: "",
      ignores_free_credit: false,
      price: 0,
      display_price: "",
      allow_comment: false,
      modifier_selection_limit: 0,
      free_modifier_credit: 0,
      modifier_credit_limit: null,
      property_tiers: [[], [], [], [], []],
      tags: [],
      metadata: [],
      sync_tag: null,
      date_updated: null,
      modifier_groups: [],
      modifiers: [],
      size_modifier_credit_limit: [],
    },
  ],
  modifier_groups: [
    {
      name: "",
      backend_name: "",
      type: "",
      free_modifier_credit: 0,
      selection_requirement: 0,
      selection_limit: 0,
      product_modifier_selection_limit_override: false,
      tags: [],
      metadata: [],
      sync_tag: null,
      pricing_strategy: "",
      date_updated: null,
      modifiers: [],
      products: [],
    },
  ],
  modifiers: [
    {
      name: "",
      backend_name: "",
      description: "",
      price: 0,
      type: "",
      plu: "",
      plu_left: "",
      plu_right: "",
      plu_remove: "",
      ignores_free_credit: false,
      product_plu_override: false,
      size_tiers: [],
      property_tiers: [[], [], [], [], []],
      tags: [],
      image_id: 0,
      metadata: [],
      sync_tag: null,
      date_updated: null,
      size_prices: [],
      credit_limit_override: false,
    },
  ],
};
  

const MenuReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CHANGE_MENU_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
      };
    case "ADD_TAG":
      return {
        ...state,
        tags: [...state.tags, action.payload],
      };
    case "REMOVE_TAG":
      return {
        ...state,
        tags: state.tags.filter((tag: any) => tag != action.payload),
      };
    case "INCREASE":
      return {
        ...state,
        quantity: state.quantity + 1,
      };
    case "DECREASE":
      return {
        ...state,
        quantity: state.quantity - 1,
      };
    default:
      return state;
  }
};

export default MenuReducer;
