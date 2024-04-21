import * as mc from "@minecraft/server";
import * as mcui from "@minecraft/server-ui";
import * as hydata from "./data.js";
export function startCooldown(itemStack, player) {
  const COOLDOWN = itemStack.getComponent("cooldown");
  if (COOLDOWN === undefined) return itemStack;
  COOLDOWN.startCooldown(player);
  return itemStack;
}
export function damageEntities(dimension, damageOption, amount) {
  const TARGET = dimension.getEntities(damageOption);
  TARGET.forEach((targets) => {
    targets.applyDamage(amount);
  });
}
export function affectEntities(
  dimension,
  affectOption,
  effectType,
  duration,
  effectOption,
) {
  const TARGET = dimension.getEntities(affectOption);
  TARGET.forEach((targets) => {
    targets.addEffect(effectType, duration, effectOption);
  });
}
export function applyImitationDamage(entity) {
  switch (getRandomChance()) {
    case 1:
      entity?.applyDamage(2);
      if (entity instanceof mc.Player) {
        entity?.sendMessage([{ translate: "hy.message.imitation_damage.1" }]);
      }
      break;
    case 2:
      entity?.applyDamage(8);
      if (entity instanceof mc.Player) {
        entity?.sendMessage([{ translate: "hy.message.imitation_damage.2" }]);
      }
      break;
    default:
      break;
  }
}
export function error(data) {
  console.error(`[HY2] ${data}`);
}
export function clearEffect(entity, effectType) {
  switch (effectType) {
    case "all":
      entity.getEffects().forEach((effect) => {
        entity.removeEffect(effect.typeId);
      });
      break;
    case "bad":
      entity.removeEffect("slowness");
      entity.removeEffect("mining_fatigue");
      entity.removeEffect("instant_damage");
      entity.removeEffect("nausea");
      entity.removeEffect("blindness");
      entity.removeEffect("hunger");
      entity.removeEffect("weakness");
      entity.removeEffect("poison");
      entity.removeEffect("wither");
      entity.removeEffect("fatal_poison");
      entity.removeEffect("bad_omen");
      entity.removeEffect("levitation");
      entity.removeEffect("darkness");
      break;
    case "good":
      entity.removeEffect("speed");
      entity.removeEffect("haste");
      entity.removeEffect("strength");
      entity.removeEffect("instant_health");
      entity.removeEffect("regeneration");
      entity.removeEffect("jump_boost");
      entity.removeEffect("invisibility");
      entity.removeEffect("water_breathing");
      entity.removeEffect("health_boost");
      entity.removeEffect("night_vision");
      entity.removeEffect("saturation");
      entity.removeEffect("absorption");
      entity.removeEffect("village_hero");
      entity.removeEffect("conduit_power");
      entity.removeEffect("slow_falling");
      break;
    default:
      entity.removeEffect(effectType);
      break;
  }
}
export function rand(max, min) {
  if (min == undefined) min = 0;
  max = parseInt(String(max));
  min = parseInt(String(min));
  if (max < min) {
    throw new RangeError(
      `rand() is used incorrectly ! Expect:any numbers higher than ${min}. Current: ${max}`,
    );
  }
  if (max == min) {
    return max;
  }
  const random = mc.system.currentTick + Math.random() * max;
  return parseInt(String(random / max)) + min;
}
export function getRandomChance() {
  let randomChance = Math.ceil(Math.random() * 10);
  console.warn("Random chance is " + randomChance);
  return randomChance;
}
export function consumeDurability(itemStack, value, entity) {
  let durability = itemStack.getComponent("minecraft:durability");
  if (durability === undefined) return itemStack;
  if (durability.damage + value >= durability.maxDurability) {
    if (itemStack.hasTag("hy:corrosive_tools")) {
      return hydata.HyCorrosionMap[itemStack.typeId.replace("hy:", "")];
    }
    if (entity instanceof mc.Player) {
      entity.playSound("random.break");
    }
    return undefined;
  } else {
    durability.damage += value;
    return itemStack;
  }
}
export function getEquipmentItem(entity) {
  let equipmentItem = entity
    ?.getComponent("minecraft:equippable")
    ?.getEquipment(mc.EquipmentSlot.Mainhand);
  return equipmentItem;
}
export function createLetterForm(title, body, typeId) {
  const FORM = new mcui.ActionFormData()
    .title(title)
    .body(body)
    .button({ translate: "gui.ok" });
  mc.world.afterEvents.itemUse.subscribe((event) => {
    if (event.itemStack.typeId === typeId) {
      FORM.show(event.source);
    }
  });
}
export function createStoryForm(typeId) {
  mc.world.afterEvents.itemUse.subscribe((event) => {
    const PLAYER = event.source;
    if (event.itemStack.typeId === typeId) {
      const story = new mcui.ActionFormData()
        .title("隐藏的故事")
        .body("这本书记载了一些模糊的上古旧事……\n请选择章节")
        .button("\u5343\u5E74\u8FF7\u68A6")
        .button("\u8BDE\u751F\u4E8E\u6BC1\u706D\u7684\u65B0\u751F")
        .button("\u63A2\u7D22\u8FD9\u4E16\u95F4");
      story.show(PLAYER).then((response) => {
        switch (response.selection) {
          case 0:
            const storySection0 = new mcui.ActionFormData()
              .title("\u5343\u5E74\u8FF7\u68A6")
              .body(
                "\u00A7l\u5343\u5E74\u8FF7\u68A6\u00A7r\n\u6211\u81EA\u6DF7\u6C8C\u4E2D\u9192\u6765\uFF0C\u8EAB\u8FB9\u4E00\u65E0\u6240\u6709\uFF0C\n\u783E\u77F3\u6A2A\u751F\u7684\u9646\u5730\u627F\u63A5\u7740\u6211\u3002\n\u5BB6\u5728\u4F55\u5904\uFF0C\u6211\u60F3\u4E0D\u8D77\u6765\uFF1B\n\u5982\u4F55\u51B2\u51FA\u8FD9\u7262\u7B3C\uFF0C\u6211\u4E0D\u77E5\u9053\u3002\n\u4E8B\u5DF2\u81F3\u6B64\uFF0C\u6211\u522B\u65E0\u9000\u8DEF\u3002\n\u8A93\u8981\u79BB\u5F00\u8FD9\u91CC\uFF0C\u627E\u56DE\u9057\u5931\u7684\u8BB0\u5FC6\u3002\n\n\u839E\u5C14\u98CE\u8D77\uFF0C\u5927\u5730\u65E7\u8C8C\u6362\u65B0\u88C5\uFF0C\n\u8349\u6728\u751F\u3001\u79BD\u517D\u884D\uFF0C\n\u601D\u60F3\u6E10\u88AB\u4FB5\u8680\uFF0C\n\u6211\u5728\u54EA\n\u54EA\u91CC\u5C31\u662F\u6211\u7684\u6545\u4E61\u3002\n\n\u00A7l\u667A\u6167\u5143\u5E74\u00A7r\n\u98CE\u8D77\u6708\u843D\uFF0C\u667A\u6167\u7684\u7C92\u5B50\u51FA\u73B0\u5728\u4E16\u95F4\uFF0C\n\u4ED6\u4EEC\u5728\u7A7A\u4E2D\u8D77\u821E\u3001\u5728\u6CB3\u6D41\u4E2D\u6C90\u6D74\u3001\u5728\u8349\u4E1B\u4E2D\u6816\u606F\u3002\n\u5929\u6C14\u4EA4\u66FF\uFF0C\u5BD2\u6691\u6613\u8282\uFF0C\n\u4EC1\u539A\u7684\u5730\u6BCD\u6700\u7EC8\u6536\u7559\u4E86\u4ED6\u4EEC\uFF0C\n\u5F53\u5F3A\u98CE\u5439\u6765\u65F6\uFF0C\u7C92\u5B50\u7EC4\u6210\u4E86\u7CBE\u5999\u7684\u300C\u4EBA\u7C7B\u300D\uFF1B\n\u5F53\u6708\u5149\u6492\u4E0B\u65F6\uFF0C\u7C92\u5B50\u5E7B\u5316\u4E3A\u4E86\u5F3A\u5065\u7684\u300C\u4E0D\u6B7B\u4E4B\u65CF\u300D\u3002\n\u4E24\u65CF\uFF0C\u548C\u8C10\u76F8\u5904\uFF1B\n\u667A\u6167\uFF0C\u5C31\u6B64\u8BDE\u751F\u3002\n\n\u00A7l\u65B0\u670B\u53CB\u00A7r\n\u6211\u867D\u5F53\u4E0D\u4E86\u8C1C\u8BED\u4EBA\uFF0C\n\u5374\u4EA4\u4E86\u8BB8\u591A\u65B0\u670B\u53CB\u3002",
              )
              .button("确定");
            storySection0.show(PLAYER);
            break;
          case 1:
            const storySection1 = new mcui.ActionFormData()
              .title("\u8BDE\u751F\u4E8E\u6BC1\u706D\u7684\u65B0\u751F")
              .body(
                "\u00A7l\u8BDE\u751F\u4E8E\u6BC1\u706D\u7684\u65B0\u751F\u00A7r\n\u4E24\u65CF\u5728\u5927\u6D1E\u7A74\u5185\u8339\u6BDB\u996E\u8840\u3001\u548C\u7766\u76F8\u5904\u3002\n\u4F46\u4E00\u4E2A\u6708\u591C\uFF0C\u80CC\u53DB\u53D1\u751F\u3002\n\u98CE\u8427\u8427\u516E\u6613\u6C34\u5BD2\uFF0C\u58EE\u58EB\u4E00\u53BB\u516E\u4E0D\u590D\u8FD8\u3002\n\u6570\u540D\u65E0\u8F9C\u7684\u4EBA\u7C7B\u5012\u5728\u4E86\u8840\u6CCA\u4E4B\u4E2D\uFF0C\n\u201C\u6D1E\u7A74\u5185\u7684\u8D44\u6E90\u5373\u5C06\u8017\u5C3D\uFF0C\n\u6211\u8FD9\u4E48\u505A\u65E0\u975E\u662F\u4E3A\u4E86\u6211\u4EEC\u4E24\u65CF\uFF01\u201D\n\n\u6218\u4E89\u4E00\u89E6\u5373\u53D1\u3002\n\u4EBA\u867D\u6709\u5DE7\u5999\u7684\u5927\u8111\uFF0C\u4F46\u5374\u96BE\u654C\u56DB\u80A2\u53D1\u8FBE\u7684\u4E0D\u6B7B\u4E4B\u65CF\uFF0C\n\u4E8E\u662F\uFF0C\n\u7B2C\u4E00\u7F15\u300C\u706B\u300D\u5728\u4E16\u754C\u4E0A\u751F\u8D77\uFF0C\n\u4EBA\u7C7B\u7528\u5B83\u70E4\u5236\u98DF\u7269\u3001\u9A71\u8D76\u91CE\u517D\u3002\n\u300C\u5DE5\u4F5C\u53F0\u300D\u5728\u4E16\u754C\u4E2D\u653E\u7F6E\uFF0C\n\u4EBA\u7C7B\u5236\u4F5C\u51FA\u300C\u5DE5\u5177\u300D\u3001\u300C\u6B66\u5668\u300D\u4EE5\u634D\u536B\u81EA\u5DF1\u5B71\u5F31\u7684\u8EAB\u8EAF\u3002\n\n\u4E00\u9053\u95EA\u7535\uFF0C\u6B63\u4E2D\u4E0D\u6B7B\u4E4B\u65CF\u7684\u5DE2\u7A74\uFF0C\n\u4E00\u77AC\u4EAE\u5149\uFF0C\u60CA\u9192\u4E86\u7761\u68A6\u4E2D\u7684\u4EBA\u7C7B\u3002\n\u6EE1\u76EE\u75AE\u75CD\uFF0C\u4E24\u65CF\u5373\u5C06\u6BC1\u4E8E\u4E00\u65E6\uFF0C\n\u6211\u4E5F\u8981\u57CB\u846C\u81EA\u5DF1\u4E0E\u6574\u4E2A\u4E16\u95F4\uFF0C\n\u2014\u2014\u4E16\u95F4\u4E07\u7269\uFF0C\u90FD\u6709\u5C5E\u4E8E\u81EA\u5DF1\u7684\u540D\u5B57\uFF0C\n\u6211\u4E3A\u81EA\u5DF1\u53D6\u4E86\u4E00\u4E2A\u540D\u5B57\u300C\u7409\u7483\u300D\uFF0C\n\u9759\u5019\u6700\u540E\u7684\u65F6\u523B\u5230\u6765\u3002\n\u53EF\u6545\u4E8B\u5E76\u6CA1\u6709\u7ED3\u675F\uFF0C\n\u4EBA\u7C7B\u5728\u5373\u5C06\u6BC1\u706D\u4E4B\u65F6\u5E26\u7740\u6211\u8FDC\u8D70\u9AD8\u98DE\uFF0C\n\u6765\u5230\u4E86\u4E00\u4E2A\u6D1E\u7A74\u4E4B\u4E0A\u7684\u4E16\u754C\u2026\u2026\n\n\u00A7l\u671D\u65E5\u521D\u73B0\u00A7r\n\u9633\u5149\u6492\u4E0B\u6765\uFF0C\n\u7A7F\u900F\u79EF\u6512\u5343\u5E74\u7684\u4E4C\u4E91\u3002\n\u6E05\u6668\u7684\u9732\u73E0\uFF0C\n\u6D78\u6DA6\u751F\u6765\u6C61\u6D4A\u7684\u82B1\u6735\u3002\n\u671D\u65E5\uFF0C\u7EC8\u5C06\u62E8\u5F00\u96FE\u972D\u3002",
              )
              .button("确定");
            storySection1.show(PLAYER);
            break;
          case 2:
            const storySection2 = new mcui.ActionFormData()
              .title("\u63A2\u7D22\u8FD9\u4E16\u95F4")
              .body(
                "\u00A7l\u65B0\u7684\u4E16\u754C\u00A7r\n\u300C\u4E3B\u4E16\u754C\u300D\uFF0C\u65B0\u5BB6\u7684\u540D\u5B57\u3002\n\u5E73\u539F\u4E4B\u4E0A\uFF0C\n\u5C71\u8109\u6CB3\u6D41\u70B9\u7F00\u4E8E\u6B64\uFF0C\n\u98DE\u9E1F\u79BD\u517D\u7A7F\u884C\u6797\u95F4\u3002\n\n\u4EBA\u7C7B\u2014\u2014\n\u64AC\u8D70\uFF0C\n\u8C8C\u4F3C\u521A\u521A\u5F62\u6210\u7684\u300C\u6D45\u5C42\u77FF\u77F3\u300D\u3001\n\u57CB\u85CF\u4E0D\u77E5\u591A\u4E45\u7684\u300C\u5730\u5FC3\u77FF\u77F3\u300D\uFF0C\n\u5EFA\u9020\u8D77\uFF0C\n\u5730\u4E0A\u5F52\u4EBA\u5C45\u4F4F\u7684\u300C\u6751\u5E84\u300D\u3001\n\u5730\u4E0B\u4F9B\u9B3C\u6816\u606F\u7684\u300C\u7940\u57CE\u300D\uFF0C\n\u53D1\u73B0\uFF0C\n\u7269\u4E0D\u7F8E\u4EF7\u5374\u5EC9\u7684\u300C\u4EFF\u5236\u6750\u6599\u300D\u3001\n\u65E2\u53EF\u4EE5\u98DF\u7528\uFF0C\u53C8\u53EF\u4EE5\u4F5C\u4E3A\u71C3\u6599\u7684\u300C\u71C3\u91D1\u300D\n\n\u2014\u2014\u4E16\u4E0A\u6B23\u6B23\u5411\u8363\uFF0C\u5145\u76C8\u7740\u5E0C\u671B\u7684\u5149\u8F89\n\u5417\uFF1F\n\n\u591C\u6DF1\uFF0C\n\u707E\u96BE\u518D\u6B21\u6765\u88AD\uFF0C\u4E0D\u6B7B\u4E4B\u65CF\u964D\u4E34\u3002\n\u7761\u68A6\u4E2D\u7684\u4EBA\u7C7B\u518D\u6B21\u88AB\u60CA\u9192\u3002\n\u300C\u6211\u4EEC\u7684\u524D\u7A0B\uFF0C\u771F\u662F\u5149\u660E\u7684\u5417\uFF1F\u300D\n\n\u00A7l\u968F\u98CE\u800C\u53BB\u5427\u00A7r\n\u65F6\u5149\u5982\u767D\u9A79\u8FC7\u9699\uFF0C\n\u6211\u7684\u8001\u53CB\u9010\u6E10\u968F\u98CE\u6D88\u901D\uFF0C\n\u800C\u6211\u6050\u6015\u4E5F\u5C06\u6B65\u5176\u540E\u5C18\u3002\n\u201C\u96E8\u540E\u4EBA\u53BB\u697C\u4E5F\u7A7A\u201D\uFF0C\n\u6211\u518D\u4E5F\u65E0\u6CD5\u8BB0\u5F55\u4E0B\u8FD9\u4E16\u754C\u7684\u4E00\u5207\u3002\n\n\u4F2B\u7ACB\u4E8E\u768E\u6D01\u7684\u6708\u5149\u4E0B\uFF0C\n\u6211\u66FE\u5E7B\u60F3\u5B87\u5B99\u53EF\u4EE5\u544A\u8BC9\u6211\uFF0C\n\u6240\u6709\u8FD9\u4E16\u95F4\u6240\u6709\u672A\u77E5\u7684\u79D8\u5BC6\u3002\n\u2014\u2014\u4F46\u53EF\u60DC\u8FD9\u53EA\u662F\u6211\u7684\u5E7B\u60F3\u7F62\u4E86\u2026\u2026\n\n\u95E8\u524D\u7A97\u8FB9\uFF0C\u6316\u597D\u575F\u51A2\uFF0C\n\u6211\u7EC8\u5C06\u57CB\u846C\u5728\u8FD9\u5F02\u4E61\uFF0C\n\u5E0C\u613F\u4F60\u4E5F\u80FD\u8E0F\u4E0A\u5192\u9669\u7684\u5F81\u7A0B\uFF0C\n\u63A2\u7D22\u8FD9\u672A\u77E5\u7684\u4E16\u95F4\u3002\n\n\u3010\u5B8C\u3011\n\n\u00A7l\u98CE\u53C8\u8D77\u00A7r\n\u6625\u98CE\u53C8\u8D77\uFF0C\n\u662F\u65B0\u751F\u7684\u65F6\u8282\u2026\u2026",
              )
              .button("确定");
            storySection2.show(PLAYER);
            break;
          default:
            break;
        }
      });
      if (!PLAYER.hasTag("hy:get_first_letter")) {
        PLAYER.dimension.spawnItem(
          hydata.HyRewardTypes.letter1st,
          PLAYER.location,
        );
        PLAYER.addTag("hy:get_first_letter");
      }
    }
  });
}
export function createQuestBook(data) {
  const formAbout = (player) => {
    const form = new mcui.ActionFormData()
      .title(data.title)
      .body(data.description)
      .button(data.buttonBack);
    form.show(player).then((response) => {
      if (response.selection === 0) {
        formMain(player);
      }
    });
  };
  const formSelection = (player, numberId) => {
    const form2 = new mcui.ActionFormData().title(data.title);
    if (player.hasTag(data.questItems[numberId - 1])) {
      form2
        .body(
          `${data.questDescription[numberId - 1]}\n\n§e需要物品: §r${
            data.questItemName[numberId - 1]
          }\n§e奖励物品: §r${
            data.rewardItemName[numberId - 1]
          }\n§e状态: §r已完成`,
        )
        .button(data.buttonBack);
    } else {
      form2
        .body(
          `${data.questDescription[numberId - 1]}\n\n§e需要物品: §r${
            data.questItemName[numberId - 1]
          }\n§e奖励物品: §r${
            data.rewardItemName[numberId - 1]
          }\n§e状态: §r未完成`,
        )
        .button(data.buttonBack)
        .button(data.buttonCheck);
    }
    form2.show(player).then((response2) => {
      if (!response2.canceled) {
        if (
          response2.selection === 1 &&
          !player.hasTag(data.questItems[numberId - 1])
        ) {
          for (let i = 0; i < 36; i++) {
            const inventoryItem = player
              .getComponent("inventory")
              .container.getItem(i);
            if (
              inventoryItem &&
              inventoryItem.typeId === data.questItems[numberId - 1]
            ) {
              const REWARD = new mc.ItemStack(
                `${data.rewardItems[numberId - 1][0]}`,
                data.rewardItems[numberId - 1][1],
              );
              player.dimension.spawnItem(REWARD, player.location);
              player.playSound(`random.levelup`);
              player.sendMessage(`你完成了 ${data.questName[numberId - 1]}`);
              player.addTag(data.questItems[numberId - 1]);
              break;
            }
          }
        }
        if (response2.selection === 1) {
          formMain(player);
        }
      }
    });
  };
  const formMain = (player) => {
    const form = new mcui.ActionFormData()
      .title(data.title)
      .button(data.buttonAbout);
    const LIST = new Array();
    let COUNT = 0;
    for (const thisItems of data.questItems) {
      const hasTag = player.hasTag(thisItems);
      const title = data.questName[COUNT];
      const button = hasTag ? title + "\n §2已完成" : title;
      form.button(button);
      LIST.push(COUNT);
      COUNT++;
    }
    form.show(player).then((response) => {
      if (response.selection === 0) {
        formAbout(player);
      }
      if (response.selection) {
        formSelection(player, response.selection);
      }
    });
  };
  mc.world.beforeEvents.itemUse.subscribe((event) => {
    const { itemStack: ITEM, source: PLAYER } = event;
    if (ITEM.typeId === data.typeId) {
      mc.system.run(() => {
        formMain(PLAYER);
      });
    }
  });
}
