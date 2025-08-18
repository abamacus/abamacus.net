// translation of Minecraft anvil mechanics into javascript (not yet complete)
// formulas taken from minecraft.gamepedia.com/Anvil/Mechanics

// "target" is item on left
// "sacrifice" is item on right

var itemTemplate = {
 ReworkCount: 1,
 Durability: 64,
 Type: 'Sword',
 Enchantments: [
  {Type: 'Sharpness', Level: 2},
  {Type: 'Mending', Level: 1}
 ]
}

function combineCost(target, sacrifice, renaming){
  if (sacrifice == null){
    // note: if ONLY renaming, some extra factors apply:
    // * prior work penalty must be paid for the rename
    // * prior work penalty is not increased
    // * if prior work penalty > 39, cost will always be set to 39, instead of "Too Expensive!"
    return null; //todo
  }
  var totalCost = 0;
  totalCost += priorWorkPenalty(target.ReworkCount);
  totalCost += priorWorkPenalty(sacrifice.ReworkCount);
  if (renaming)
    totalCost += 1;
  if (target.Durability < max && sacrifice.Durability > 0)
    totalCost += 2;
  totalCost += enchantmentCost(target, sacrifice, javaEdition);
  if (totalCost > 39)
    throw new Error('Too Expensive!');
  return totalCost;
  // Durability notes:
  // if repairing with a material (iron ingot, cobblestone, diamond, planks, phantom membrane, gold ingot, leather, scute)
  //  then the Durability increase is 25% per material count, rounded down.
  // if repairing with same item,
  //  result.Durability = target.Durability + sacrifice.Durability + 12% (of max for item type)
}

function priorWorkPenalty(reworkCount){
  // 0, 1, 3, 7, 15, 31, ...
  return Math.pow(2, reworkCount) - 1;
}

function enchantmentCost(target, sacrifice, javaEdition){
  var fromBook = (sacrifice.Durability == 0);
  var totalCost = 0;
  for each (var sacrificeEnchantment in sacrifice.Enchantments) {
    if (fromBook && enchantmentIncompatible(sacrificeEnchantment, target.Type)){
      // ignore cost (only possible if sacrifice is a book)
    } else if (conflictingEnchantment()){
      if (javaEdition)
        totalCost += 1;
    } else {
      var resultLevel = getResultLevel(sacrificeEnchantment, target.Enchantment[sacrificeEnchantment.Type]);
      var increaseLevel;
      if (javaEdition) {
        increaseLevel = resultLevel;
      } else {
        if (resultLevel > target.Enchantment[sacrificeEnchantment.Type].Level)
          increaseLevel = resultLevel - target.Enchantment[sacrificeEnchantment.Type].Level;
        else
          increaseLevel = 0;
      }
    }
    totalCost += increaseLevel * multiplierCost(enchantment, level, fromBook);
  }
  return totalCost;
}

function enchantmentIncompatible(){
  return null;
}

function conflictingEnchantment(){
/* sharpness, smite, bane of arthropods
  fortune, silk touch
  protection, fire protection, blast protection, projectile protection
  depth strider, frost walker
  infinity, mending
  multishot, piercing
*/
  return null;
}

function getResultLevel(){
  return null;
}

function multiplierCost(enchantment, level, fromBook){
  var baseCost = multiplierBaseCost(enchantment);
  if (fromBook)
    baseCost = Math.ceil(baseCost / 2);
  baseCost = baseCost * level;
}

function multiplierBaseCost(enchantment)
 switch (enchantment){
  case 'Thorns':
  case 'Silk Touch':
  case 'Infinity':
  case 'Curse of Binding':
  case 'Curse of Vanishing':
  case 'Channeling':
   return 8;

  case 'Blast Protection':
  case 'Respiration':
  case 'Depth Strider':
  case 'Aqua Affinity':
  case 'Fire Aspect':
  case 'Looting':
  case 'Fortune':
  case 'Punch':
  case 'Flame':
  case 'Luck of the Sea':
  case 'Lure':
  case 'Frost Walker':
  case 'Mending':
  case 'Impaling':
  case 'Riptide':
  case 'Multishot':
  case 'Sweeping Edge':
   return 4;
  
  case 'Fire Protection':
  case 'Feather Falling':
  case 'Projectile Protection':
  case 'Smite':
  case 'Bane of Arthropods':
  case 'Knockback':
  case 'Unbreaking':
  case 'Quick Charge':
   return 2;

  case 'Protection':
  case 'Sharpness':
  case 'Efficiency':
  case 'Power':
  case 'Loyalty':
  case 'Piercing':
   return 1;

  default:
   console.log('invalid enchantment "' + enchantment + '" in multiplierBaseCost()');
   return null;
 }
}
