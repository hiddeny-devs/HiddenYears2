import * as mc from "@minecraft/server";
import { QuestBook } from "./data.js";
export declare function startCooldown(
  itemStack: mc.ItemStack,
  player: mc.Player,
): mc.ItemStack;
export declare function damageEntities(
  dimension: mc.Dimension,
  damageOption: mc.EntityQueryOptions,
  amount: number,
): void;
export declare function affectEntities(
  dimension: mc.Dimension,
  affectOption: mc.EntityQueryOptions,
  effectType: mc.EffectType | string,
  duration: number,
  effectOption?: mc.EntityEffectOptions,
): void;
export declare function applyImitationDamage(entity: mc.Entity): void;
export declare function error(data: any): void;
export declare function clearEffect(
  entity: mc.Entity,
  effectType: mc.EffectType | string,
): void;
export declare function rand(max: number, min?: number): number;
export declare function getRandomChance(): number;
export declare function consumeDurability(
  itemStack: mc.ItemStack,
  value: number,
  entity?: mc.Entity,
): any;
export declare function getEquipmentItem(entity: mc.Entity): mc.ItemStack;
export declare function createLetterForm(
  title: string,
  body: string,
  typeId: string,
): void;
export declare function createStoryForm(typeId: string): void;
export declare function createQuestBook(data: QuestBook): void;
