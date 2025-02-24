import { MerchantData, MerchantsMap } from "./types";

export class Merchant {
  private static merchants: MerchantsMap | null = null;
  private networkId: string;

  constructor({ networkId }: { networkId: string }) {
    this.networkId = networkId;
  }

  static async initialize(): Promise<void> {
    if (this.merchants === null) {
      const response = await fetch(
        "https://raw.githubusercontent.com/hackclub/yellow_pages/main/lib/yellow_pages/merchants.yaml",
      );
      const text = await response.text();
      const yaml = await import("js-yaml");
      const data = yaml.load(text) as MerchantData[];

      this.merchants = data.reduce((acc, merchant) => {
        if (!merchant.name) return acc;

        const filename = merchant.name.replace(/[ '-]/g, "").toLowerCase();
        const iconUrl = `https://raw.githubusercontent.com/hackclub/yellow_pages/main/lib/assets/icons/${filename}.svg`;

        merchant.network_ids.forEach((networkId) => {
          acc[networkId] = {
            name: merchant.name,
            iconUrl,
          };
        });
        return acc;
      }, {} as MerchantsMap);
    }
  }

  static lookup(params: { networkId: string }): Merchant {
    return new Merchant(params);
  }

  private get merchant() {
    if (!Merchant.merchants) {
      throw new Error(
        "Merchants not initialized. Call Merchant.initialize() first",
      );
    }
    return Merchant.merchants[this.networkId];
  }

  getName(): string | undefined {
    return this.merchant?.name;
  }

  async getIcon(): Promise<string | undefined> {
    if (!this.merchant?.iconUrl) return undefined;

    try {
      const response = await fetch(this.merchant.iconUrl);
      if (!response.ok) return undefined;
      return await response.text();
    } catch {
      return undefined;
    }
  }

  inDataset(): boolean {
    return this.merchant !== undefined;
  }
}
