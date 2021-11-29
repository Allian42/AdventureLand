//params
var server_region = "US"
var server_identifier = "II"
var min_HP = character.max_hp - 100;
var min_MP = character.max_mp - 100;
var list_gear = ["blade", "staff", "wand", "wshield", "helmet", "coat", "gloves", "pants", "shoes"];
var keep_items_deposit = ["hpot0", "mpot0", "stand0", "blade", "staff", "wand", "wshield", "helmet", "coat", "gloves", "pants", "shoes"];
var keep_items_hunt = ["hpot0", "mpot0"];
var monster_to_hunt = "snake";
var warrior = "AllianW"
var merchant = "AllianM"
var mage = "Allian"
var priest = "AllianP"

console.log("helper")

const my_wait = time => new Promise(p => setTimeout(p, time));

function check_server()
{
    if(parent.server_region != server_region || parent.server_identifier != server_identifier)
        change_server(server_region, server_identifier);
}

function equip_better_items()
{
    for (var i = 0; i < 42; i++)
    {
        let inv_item = character.items[i];
        if(!inv_item || !inv_item.hasOwnProperty("level"))
        {
            continue;
        }

        let comparing_slot = undefined;        
        switch(inv_item.name)
        {
            case "staff":
                comparing_slot = character.slots.mainhand;
                break;
            case "blade":
                comparing_slot = character.slots.mainhand;
                break;
            case "wshield":
                comparing_slot = character.slots.offhand;
                break;
            case "helmet":
                comparing_slot = character.slots.helmet;
                break;
            case "coat":
                comparing_slot = character.slots.chest;
                break;
            case "gloves":
                comparing_slot = character.slots.gloves;
                break;
            case "pants":
                comparing_slot = character.slots.pants;
                break;
            case "shoes":
                comparing_slot = character.slots.shoes;
                break;
            default:
                break;
        }

        let gear_level = 0

        if(comparing_slot)
        {
            gear_level = comparing_slot.level;
        }
            
        if(inv_item.level > gear_level)
        {
            if(inv_item.name == "blade")
                equip(i, "mainhand");
            else
                equip(i);
        }
    }
}

function register_item_need(flag)
{
	set(flag + "hp", quantity("hpot0"));
    set(flag + "mp", quantity("mpot0"));

    let list_slots = ["mainhand", "offhand", "helmet", "chest", "gloves", "pants", "shoes"];
    
    for (const a_slot of list_slots) 
    {
        if(character.slots[a_slot])
            set(flag + a_slot, character.slots[a_slot].level);
        else
            set(flag + a_slot, 0);
    }
}

function send_to_merchant()
{
	var MerchantEntity = get_player(merchant);
	if(MerchantEntity)
	{
		send_gold(MerchantEntity, character.gold);
		for (var i = 0; i < 42; i ++)
		{
            let item = character.items[i];
			if(item && !keep_items_hunt.includes(item.name))
				send_item(MerchantEntity,i,item.q);
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