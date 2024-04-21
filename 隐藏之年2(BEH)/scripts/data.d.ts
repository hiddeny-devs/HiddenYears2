import * as mc from "@minecraft/server";
export interface QuestBook {
  typeId: string;
  title: string;
  description: string;
  buttonAbout: string;
  buttonBack: string;
  buttonCheck: string;
  questItems: string[];
  rewardItems: [string, number][];
  questItemName: string[];
  rewardItemName: string[];
  questName: string[];
  questDescription: string[];
}
export declare const HyCorrosionMap: {
  copper_axe: mc.ItemStack;
  exposed_copper_axe: mc.ItemStack;
  weathered_copper_axe: mc.ItemStack;
  copper_hammer: mc.ItemStack;
  exposed_copper_hammer: mc.ItemStack;
  weathered_copper_hammer: mc.ItemStack;
  copper_hoe: mc.ItemStack;
  exposed_copper_hoe: mc.ItemStack;
  weathered_copper_hoe: mc.ItemStack;
  copper_knife: mc.ItemStack;
  exposed_copper_knife: mc.ItemStack;
  weathered_copper_knife: mc.ItemStack;
  copper_pickaxe: mc.ItemStack;
  exposed_copper_pickaxe: mc.ItemStack;
  weathered_copper_pickaxe: mc.ItemStack;
  copper_shovel: mc.ItemStack;
  exposed_copper_shovel: mc.ItemStack;
  weathered_copper_shovel: mc.ItemStack;
  copper_sword: mc.ItemStack;
  exposed_copper_sword: mc.ItemStack;
  weathered_copper_sword: mc.ItemStack;
};
export declare const HyRewardTypes: {
  questBook1st: mc.ItemStack;
  letter1st: mc.ItemStack;
  diamondBlock: mc.ItemStack;
  goldBlock: mc.ItemStack;
  scrap: mc.ItemStack;
  template: mc.ItemStack;
  apple: mc.ItemStack;
};
export declare const enum HyItemTypes {
  bark = "hy:bark",
  letterDimension = "hy:letter_dimension",
}
export declare const enum HyBlockTypes {}
export declare const HyQuest1st: QuestBook;
