import * as mc from "@minecraft/server";
import * as hy from "./utils.js";
import * as hydata from "./data.js";
import * as hytext from "./text.js";
hy.createQuestBook(hydata.HyQuest1st);
hy.createStoryForm("hy:story_book");
for (let i = 0; i <= 10; i++) {
  hy.createLetterForm(
    hytext.HyLetterTitle[i],
    hytext.HyLetterBody[i],
    `hy:letter_${i}`,
  );
}
mc.world.afterEvents.playerSpawn.subscribe((event) => {
  const PLAYER = event.player;
  if (!PLAYER.hasTag("hy:get_quest_book")) {
    hydata.HyRewardTypes.questBook1st.keepOnDeath = true;
    hydata.HyRewardTypes.questBook1st.lockMode = mc.ItemLockMode.inventory;
    PLAYER.dimension.spawnItem(
      hydata.HyRewardTypes.questBook1st,
      PLAYER.location,
    );
    PLAYER.addTag("hy:get_quest_book");
  }
});
mc.world.afterEvents.playerBreakBlock.subscribe((event) => {
  const ENTITY = event.player;
  let ITEM = hy.getEquipmentItem(ENTITY);
  if (ITEM?.hasTag("hy:custom_tools")) {
    const NEW_ITEM = hy.consumeDurability(ITEM, 1, ENTITY);
    ENTITY?.getComponent("minecraft:equippable")?.setEquipment(
      mc.EquipmentSlot.Mainhand,
      NEW_ITEM,
    );
  } else if (ITEM?.hasTag("hy:custom_weapons")) {
    const NEW_ITEM = hy.consumeDurability(ITEM, 2, ENTITY);
    ENTITY?.getComponent("minecraft:equippable")?.setEquipment(
      mc.EquipmentSlot.Mainhand,
      NEW_ITEM,
    );
  }
  if (ITEM?.hasTag("hy:imitation_tools")) {
    hy.applyImitationDamage(ENTITY);
  }
});
mc.world.afterEvents.entityHitEntity.subscribe((event) => {
  const ENTITY = event.damagingEntity;
  let ITEM = hy.getEquipmentItem(event.damagingEntity);
  if (ITEM?.hasTag("hy:custom_weapons")) {
    const NEW_ITEM = hy.consumeDurability(ITEM, 1);
    ENTITY?.getComponent("minecraft:equippable")?.setEquipment(
      mc.EquipmentSlot.Mainhand,
      NEW_ITEM,
    );
  }
  if (ITEM?.hasTag("hy:custom_tools")) {
    const NEW_ITEM = hy.consumeDurability(ITEM, 2);
    ENTITY?.getComponent("minecraft:equippable")?.setEquipment(
      mc.EquipmentSlot.Mainhand,
      NEW_ITEM,
    );
  }
  if (ITEM?.hasTag("hy:imitation_tools")) {
    hy.applyImitationDamage(ENTITY);
  }
});
mc.world.afterEvents.itemUse.subscribe((event) => {
  const PLAYER = event.source;
  if (event.itemStack.hasTag("hy:magic_explode") === true) {
    if (PLAYER.level > 1) {
      PLAYER.addTag("hy.magic_explode");
      let ITEM = hy.getEquipmentItem(PLAYER);
      const NEW_ITEM = hy.consumeDurability(ITEM, 1, PLAYER);
      hy.startCooldown(NEW_ITEM, PLAYER);
      PLAYER.getComponent("minecraft:equippable")?.setEquipment(
        mc.EquipmentSlot.Mainhand,
        NEW_ITEM,
      );
      PLAYER.addLevels(-1);
      const ALL_OPTION = {
        location: PLAYER.location,
        maxDistance: 10,
        excludeTags: ["hy.magic_explode"],
        excludeFamilies: ["noaoe"],
      };
      hy.damageEntities(PLAYER.dimension, ALL_OPTION, 10);
      switch (event.itemStack.typeId) {
        case "hy:diamond_bone":
        case "hy:gold_bone":
        case "hy:iron_bone":
          const SKELETON_OPINION = {
            location: PLAYER.location,
            maxDistance: 18,
            families: ["skeleton"],
          };
          hy.damageEntities(PLAYER.dimension, SKELETON_OPINION, 8);
          hy.affectEntities(
            PLAYER.dimension,
            SKELETON_OPINION,
            "weakness",
            300,
          );
          break;
        case "hy:flash_metal_boardsword":
          hy.damageEntities(PLAYER.dimension, ALL_OPTION, 8);
          hy.affectEntities(PLAYER.dimension, ALL_OPTION, "weakness", 300);
          break;
        case "hy:corrosion_boardsword":
          const UNDEAD_OPINION = {
            location: PLAYER.location,
            maxDistance: 18,
            families: ["undead"],
          };
          hy.damageEntities(PLAYER.dimension, UNDEAD_OPINION, 8);
          hy.affectEntities(PLAYER.dimension, UNDEAD_OPINION, "weakness", 300);
          break;
        case "hy:emerald_boardsword":
          const ILLAGER_OPINION = {
            location: PLAYER.location,
            maxDistance: 18,
            families: ["illager"],
          };
          hy.damageEntities(PLAYER.dimension, ILLAGER_OPINION, 8);
          hy.affectEntities(PLAYER.dimension, ILLAGER_OPINION, "weakness", 300);
          break;
        case "hy:flash_copper_boardsword":
          const ARTHROPOD_OPINION = {
            location: PLAYER.location,
            maxDistance: 18,
            families: ["arthropod"],
          };
          hy.damageEntities(PLAYER.dimension, ARTHROPOD_OPINION, 8);
          hy.affectEntities(
            PLAYER.dimension,
            ARTHROPOD_OPINION,
            "weakness",
            300,
          );
          break;
        case "hy:amethyst_boardsword":
          const POULTRY_OPINION = {
            location: PLAYER.location,
            maxDistance: 18,
            families: ["poultry"],
          };
          hy.damageEntities(PLAYER.dimension, POULTRY_OPINION, 8);
          hy.affectEntities(PLAYER.dimension, POULTRY_OPINION, "weakness", 300);
          break;
        case "hy:ruby_boardsword":
          const RUBY_OPINION = {
            location: PLAYER.location,
            maxDistance: 18,
            families: ["ruby"],
          };
          hy.damageEntities(PLAYER.dimension, RUBY_OPINION, 8);
          hy.affectEntities(PLAYER.dimension, RUBY_OPINION, "weakness", 300);
          break;
        default:
          break;
      }
      mc.system.runTimeout(() => {
        PLAYER.removeTag("hy.magic_explode");
      }, 100);
    } else {
      PLAYER.sendMessage([{ translate: "hy.message.no_exp" }]);
    }
  }
});
mc.world.afterEvents.itemUse.subscribe((event) => {
  const ITEM = event.itemStack;
  const PLAYER = event.source;
  if (ITEM.hasTag("hy:single_use")) {
    PLAYER?.getComponent("minecraft:equippable")?.setEquipment(
      mc.EquipmentSlot.Mainhand,
      undefined,
    );
    switch (ITEM.typeId) {
      case "hy:ruby_bag":
        switch (hy.getRandomChance()) {
          case 1:
          case 2:
            PLAYER.dimension.spawnItem(
              hydata.HyRewardTypes.diamondBlock,
              PLAYER.location,
            );
            break;
          case 3:
          case 4:
          case 5:
            PLAYER.dimension.spawnItem(
              hydata.HyRewardTypes.goldBlock,
              PLAYER.location,
            );
            break;
          case 6:
            PLAYER.dimension.spawnItem(
              hydata.HyRewardTypes.scrap,
              PLAYER.location,
            );
            break;
          case 7:
            PLAYER.dimension.spawnItem(
              hydata.HyRewardTypes.template,
              PLAYER.location,
            );
            break;
          default:
            PLAYER.dimension.spawnItem(
              hydata.HyRewardTypes.apple,
              PLAYER.location,
            );
        }
        break;
      case "hy:experience_calamity_bag":
        PLAYER.dimension.spawnEntity("hy:king_of_ruby", PLAYER.location);
        break;
      case "hy:ruby_runes":
        PLAYER.addLevels(hy.getRandomChance());
        PLAYER.playSound("random.orb");
        PLAYER.addEffect("fire_resistance", 1200);
        PLAYER.addEffect("resistance", 1200);
        break;
      case "hy:copper_badge":
        PLAYER.addEffect("health_boost", 300, {
          amplifier: 2,
        });
        break;
      case "hy:diamond_badge":
        PLAYER.addEffect("health_boost", 900, {
          amplifier: 4,
        });
        break;
      case "hy:golden_badge":
        PLAYER.addEffect("health_boost", 600, {
          amplifier: 4,
        });
        break;
      case "hy:bandage":
        PLAYER.addEffect("regeneration", 1200);
        PLAYER.addEffect("resistance", 600);
        PLAYER.addEffect("instant_health", 5);
        PLAYER.playSound("use.cloth");
        break;
      case "hy:medicine_pack":
        PLAYER.addEffect("regeneration", 1200);
        PLAYER.addEffect("resistance", 600);
        PLAYER.addEffect("fire_resistance", 600);
        PLAYER.addEffect("instant_health", 10);
        PLAYER.playSound("use.cloth");
        break;
      default:
        break;
    }
  }
});
mc.world.afterEvents.itemCompleteUse.subscribe((event) => {
  const ITEM = event.itemStack;
  const PLAYER = event.source;
  switch (ITEM.typeId) {
    case "hy:honey_candy":
      PLAYER.addEffect("saturation", 600);
      break;
    case "hy:syrup":
      PLAYER.addEffect("fire_resistance", 160);
      break;
    case "hy:chocolate_paste":
      PLAYER.addEffect("fire_resistance", 900);
      break;
    case "hy:milk_chocolate":
      hy.clearEffect(PLAYER, "all");
      break;
    case "hy:sweet_berry_chocolate":
      PLAYER.addEffect("instant_health", 1, {
        amplifier: 1,
      });
      break;
    case "hy:amethyst_chocolate":
      PLAYER.addLevels(2);
      break;
    case "hy:marshmallow":
      if (hy.getRandomChance() > 5) {
        PLAYER.addEffect("levitation", 100);
      }
      break;
    case "hy:sweet_berry_marshmallow":
      PLAYER.addEffect("instant_health", 1);
      break;
    case "hy:amethyst_marshmallow":
      PLAYER.addLevels(3);
      break;
    case "hy:medicine_1":
      PLAYER.removeEffect("nausea");
      PLAYER.removeEffect("hunger");
      PLAYER.addEffect("saturation", 400);
      break;
    case "hy:medicine_2":
      hy.clearEffect(PLAYER, "bad");
      break;
    case "hy:medicine_3":
      PLAYER.removeEffect("darkness");
      PLAYER.removeEffect("blindness");
      PLAYER.addEffect("night_vision", 400);
      break;
    case "hy:medicine_4":
      PLAYER.addEffect("darkness", 600);
      PLAYER.addEffect("blindness", 600);
      PLAYER.removeEffect("night_vision");
      break;
    case "hy:medicine_5":
      PLAYER.removeEffect("wither");
      PLAYER.removeEffect("poison");
      PLAYER.removeEffect("fatal_poison");
      PLAYER.addEffect("absorption", 400);
      break;
    case "hy:medicine_6":
      PLAYER.removeEffect("weakness");
      PLAYER.addEffect("strength", 400);
      break;
    case "hy:medicine_7":
      PLAYER.removeEffect("slowness");
      PLAYER.addEffect("speed", 600);
      break;
    case "hy:medicine_8":
      PLAYER.removeEffect("slowness");
      PLAYER.addEffect("jump_boost", 600);
      break;
    case "hy:medicine_9":
      PLAYER.addEffect("poison", 400);
      PLAYER.addEffect("slowness", 400);
      PLAYER.addEffect("weakness", 400);
      break;
    case "hy:medicine_10":
      PLAYER.kill();
      break;
    case "hy:medicine_11":
      hy.clearEffect(PLAYER, "good");
      break;
    case "hy:medicine_12":
      PLAYER.removeEffect("bad_omen");
      PLAYER.addEffect("village_hero", 3000);
      break;
    case "hy:medicine_13":
      PLAYER.removeEffect("mining_fatigue");
      PLAYER.addEffect("water_breathing", 200);
      break;
    case "hy:medicine_14":
      PLAYER.addEffect("fire_resistance", 400);
      break;
    case "hy:medicine_15":
      PLAYER.addEffect("health_boost", 6000);
      break;
    case "hy:ruby_apple":
      PLAYER.addExperience(3);
      mc.world.playSound("random.orb", PLAYER.location);
      break;
    case "hy:copper_apple":
      PLAYER.addEffect("absorption", 600);
      PLAYER.addEffect("fire_resistance", 200);
      break;
    case "hy:enchanted_copper_apple":
      PLAYER.addEffect("absorption", 1200);
      PLAYER.addEffect("fire_resistance", 1200);
      PLAYER.addEffect("speed", 200);
      break;
    case "hy:fuel_metal":
      mc.world.sendMessage([{ translate: "hy.message.fuel_metal" }]);
      PLAYER.addEffect("fatal_poison", 1200);
      break;
    case "hy:mineral_fuel_metal":
      PLAYER.addEffect("fatal_poison", 800, {
        amplifier: 1,
      });
      break;
    case "hy:fuel_metal_stick":
      PLAYER.applyDamage(2);
      break;
    default:
      break;
  }
});
mc.world.afterEvents.playerBreakBlock.subscribe((event) => {
  const BLOCK = event.brokenBlockPermutation;
  const PLAYER = event.player;
  const ITEM = hy.getEquipmentItem;
  if (BLOCK.hasTag("hy:experience_ores")) {
    PLAYER.dimension.spawnEntity("xp_orb", PLAYER.location);
  }
  if (
    BLOCK.hasTag("hy:suspicious_ores") &&
    ITEM.hasTag("minecraft:is_pickaxe")
  ) {
    if (hy.getRandomChance() <= 8) {
      PLAYER.dimension.spawnEntity("silverfish", PLAYER.location);
      PLAYER.dimension.spawnEntity("silverfish", PLAYER.location);
    } else {
      PLAYER.dimension.createExplosion(PLAYER.location, 4, {
        causesFire: true,
        allowUnderwater: true,
      });
    }
  }
});
mc.world.afterEvents.entityDie.subscribe((event) => {
  const ENTITY = event.deadEntity;
  if (ENTITY.typeId === "hy:king_of_ruby") {
    mc.world.stopMusic();
    mc.world.sendMessage([{ translate: "hy.bossdead.ruby" }]);
  }
});
mc.world.afterEvents.entityHitEntity.subscribe((event) => {
  const ATTACKER = event.damagingEntity;
  const TARGET = event.hitEntity;
  const ITEM = hy.getEquipmentItem(ATTACKER);
  switch (ITEM.typeId) {
    case "hy:ruby_boardsword":
      if (ATTACKER instanceof mc.Player) ATTACKER.addExperience(hy.rand(4, 0));
      break;
    default:
      break;
  }
  switch (ATTACKER.typeId) {
    case "hy:king_of_ruby":
      if (TARGET instanceof mc.Player) TARGET.addExperience(-15);
      break;
    default:
      break;
  }
});
