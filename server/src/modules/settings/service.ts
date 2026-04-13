import prisma from "@/lib/prisma";

export interface UpdateSettingsData {
  storeName?: string;
  storeEmail?: string;
  currency?: string;
  language?: string;
}

export const settingsService = {
  get: async () => {
    let settings = await prisma.settings.findFirst();
    
    // Seed default if empty
    if (!settings) {
       settings = await prisma.settings.create({
         data: {
           storeName: "Zenda Premium Store",
           storeEmail: "support@zenda.com",
           currency: "USD ($)",
           language: "en"
         }
       });
    }
    
    return settings;
  },

  update: async (data: UpdateSettingsData) => {
    const settings = await settingsService.get();
    return await prisma.settings.update({
      where: { id: settings.id },
      data,
    });
  },
};
