//params
var min_HP = character.max_hp - 100;
var min_MP = character.max_mp - 100;
var keep_items = ["hpot0", "mpot0", "stand0"];
var monster_to_hunt = "snake";
var warrior = "AllianW"
var merchant = "AllianM"
var mage = "Allian"
var priest = "AllianP"

//change_server("US","III");

const my_wait = time => new Promise(p => setTimeout(p, time));

function equip_better_items()
{
    for (var i = 0; i < 42; i ++)
    {
        let inv_item = character.items[i];
        if(!inv_item)
            return;
        
        switch(inv_item.name)
        {
            case "staff":
                if(inv_item.level > character.slots.mainhand.level)
                    equip(i);
                break;
            case "blade":
                if(inv_item.level > character.slots.mainhand.level)
                    equip(i);
                break;
            case "wshield":
                if(inv_item.level > character.slots.offhand.level)
                    equip(i);
                break;
            case "helmet":
                if(inv_item.level > character.slots.helmet.level)
                    equip(i);
                break;
            case "coat":
                if(inv_item.level > character.slots.chest.level)
                    equip(i);
                break;
            case "gloves":
                if(inv_item.level > character.slots.gloves.level)
                    equip(i);
                break;
            case "pants":
                if(inv_item.level > character.slots.pants.level)
                    equip(i);
                break;
            case "shoes":
                if(inv_item.level > character.slots.shoes.level)
                    equip(i);
                break;
            default:
                break;
        }
    }
}

function register_item_need(flag)
{
	set(flag + "hp", quantity("hpot0"));
	set(flag + "mp", quantity("mpot0"));
	set(flag + "mainhand", character.slots.mainhand.level);
	set(flag + "offhand", character.slots.offhand.level);
	set(flag + "helmet", character.slots.helmet.level);
	set(flag + "chest", character.slots.chest.level);
	set(flag + "gloves", character.slots.gloves.level);
	set(flag + "pants", character.slots.pants.level);
	set(flag + "shoes", character.slots.shoes.level);
}

function send_to_merchant()
{
	var MerchantEntity = get_player(merchant);
	if(MerchantEntity)
	{
		send_gold(MerchantEntity, character.gold);
		for (var i = 0; i < 42; i ++)
		{
			if(character.items[i] && !keep_items.includes(character.items[i].name))
				send_item(MerchantEntity,i,character.items[i].q);
		}
	}
}

function regen_hp_mp(flag)
{
	if (character.hp < min_HP || character.mp < min_MP)
	{
		use_hp_or_mp();
	}
	if(!is_on_cooldown("regen_hp") && character.hp < min_HP)
		use_skill("regen_hp");
	if(!is_on_cooldown("regen_mp") && character.mp < min_MP)
		use_skill("regen_mp");
}

character.on("stacked",async function(data)
{
    var movement1 = Math.random() * (20 + 20) - 20;
    var movement2 = Math.random() * (20 + 20) - 20;
    await move(character.x + movement1, character.y + movement2);
});

async function close_target_distance(target)
{
	if(!in_attack_range(target))
	{
		var moveX = character.x+(target.x-character.x)/2
		var moveY = character.y+(target.y-character.y)/2
		
		await move(moveX,moveY);
	}
}

function try_attack(target)
{
	if(!can_attack(target) || character.mp < character.mp_cost)
	{
        return;
    }
    change_target(target);
    attack(target);	
}