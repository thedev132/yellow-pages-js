export type CategoryData = {
  code: string;
  name: string;
  key: string;
};

export type MerchantData = {
  name: string;
  network_ids: string[];
};

export type CategoriesMap = {
  [code: string]: CategoryData;
};

export type CategoriesByKeyMap = {
  [key: string]: CategoryData;
};

export type MerchantsMap = {
  [networkId: string]: {
    name: string;
    iconUrl: string;
  };
};
