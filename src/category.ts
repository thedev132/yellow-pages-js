import { CategoriesByKeyMap, CategoriesMap, CategoryData } from "./types";

export class Category {
  private static categoriesByCode: CategoriesMap | null = null;
  private static categoriesByKey: CategoriesByKeyMap | null = null;
  private code?: string;
  private key?: string;

  constructor({ code, key }: { code?: string; key?: string }) {
    if (!code && !key) {
      throw new Error("Either code or key must be provided");
    }
    this.code = code;
    this.key = key;
  }

  static async initialize(): Promise<void> {
    if (this.categoriesByCode === null) {
      const response = await fetch(
        "https://raw.githubusercontent.com/hackclub/yellow_pages/main/lib/yellow_pages/categories.yaml",
      );
      const text = await response.text();
      const yaml = await import("js-yaml");
      const data = yaml.load(text) as Record<string, any>;

      this.categoriesByCode = Object.entries(data).reduce(
        (acc, [code, obj]) => {
          acc[code.toString()] = {
            code: code.toString(),
            ...obj,
            key: obj.key,
          };
          return acc;
        },
        {} as CategoriesMap,
      );

      this.categoriesByKey = Object.values(this.categoriesByCode).reduce(
        (acc, category) => {
          acc[category.key] = category;
          return acc;
        },
        {} as CategoriesByKeyMap,
      );
    }
  }

  static lookup(params: { code?: string; key?: string }): Category {
    return new Category(params);
  }

  private get category(): CategoryData | undefined {
    if (!Category.categoriesByCode || !Category.categoriesByKey) {
      throw new Error(
        "Categories not initialized. Call Category.initialize() first",
      );
    }

    if (this.code) {
      return Category.categoriesByCode[this.code];
    } else if (this.key) {
      return Category.categoriesByKey[this.key];
    }
    return undefined;
  }

  getCode(): string | undefined {
    return this.category?.code;
  }

  getName(): string | undefined {
    return this.category?.name;
  }

  getKey(): string | undefined {
    return this.category?.key;
  }

  inDataset(): boolean {
    return this.category !== undefined;
  }
}
