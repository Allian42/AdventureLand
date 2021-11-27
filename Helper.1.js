//params
var min_HP = character.max_hp - 100;
var min_MP = character.max_mp - 100;
var keep_items = ["hpot0", "mpot0", "stand0"];
var monster_to_hunt = "snake";
var warrior = "AllianW"
var merchant = "AllianM"
var mage = "Allian"
var priest = "AllianP"

function send_to_merchant()
{
	var MerchantEntity = get_player(merchant);
	if(MerchantEntity)
	{
		send_gold(MerchantEntity,character.gold);
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
    var movement = Math.random() * (20 + 20) - 20;
    await move(character.x + movement, character.y + movement);
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