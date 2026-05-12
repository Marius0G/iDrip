const delay = (ms: number = 300) => new Promise((r) => setTimeout(r, ms));

export const outfitService = {
  async generate(): Promise<void> { await delay(1500); },
  async getAll(): Promise<void> { await delay(); },
  async delete(_id: string): Promise<void> { await delay(); },
};
