const delay = (ms: number = 300) => new Promise((r) => setTimeout(r, ms));

export const shoppingService = {
  async getRecommendations(): Promise<void> { await delay(500); },
};
