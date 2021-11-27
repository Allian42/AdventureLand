//params
var min_HP_pot = 100;
var min_MP_pot = 100;
var HP_pot_price = 20;
var MP_pot_price = 20;
var min_HP = character.max_hp - 100;
var min_MP = character.max_mp - 100;
var keep_items = ["hpot0", "mpot0", "stand0"];
var monster_to_hunt = "snake";
var warrior = "AllianW"
var merchant = "AllianM"
var mage = "Allian"
var priest = "AllianP"

function set_party()
{
    if(!get_party())
    {
        send_party_invite(warrior);
        send_party_invite(mage);
        send_party_invite(priest);
        accept_party_invite(warrior);
        accept_party_invite(mage);
        accept_party_invite(priest);
    }
}

function register_pot_need(flag)
{
	var q_hp = min_HP_pot - quantity("hpot0");
	var q_mp = min_MP_pot - quantity("mpot0");
	
	if(q_hp < 0) q_hp = 0;
	if(q_mp < 0) q_mp = 0;
	
	set(flag + "hp", q_hp);
	set(flag + "mp", q_mp);
}

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

async function warrior_target()
{
    let target = get_targeted_monster();
    if(!target)  target = get_nearest_monster({type:monster_to_hunt});
    return target;
}

async function setup_hunting_ground()
{
    let test_monster = get_nearest_monster({type:monster_to_hunt});
    if(!test_monster)
    {
        await smart_move(monster_to_hunt);
    }
    warrior_entity = get_player(warrior);
    if(!warrior_entity)
    {
        use_skill("magiport", warrior);
        send_cm(warrior, "magiport");
    }
}

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

function buy_pots()
{
	var hp = 0;
	var mp = 0;
	
	hp = hp + get("mage_hp");
	hp = hp + get("priest_hp");
	hp = hp + get("warrior_hp");
	
	hp = hp - quantity("hpot0");
	
	mp = mp + get("mage_mp");
	mp = mp + get("priest_mp");
	mp = mp + get("warrior_mp");
	
	mp = mp - quantity("mpot0");
	
	buy("hpot0", hp);
	buy("mpot0", mp);
}

function give_pots()
{
	var hp_mage = get("mage_hp");
	var hp_priest = get("priest_hp");
	var hp_warrior = get("warrior_hp");
	
	var mp_mage = get("mage_mp");
	var mp_priest = get("priest_mp");
	var mp_warrior = get("warrior_mp");
	
	var mageEntity = get_player(mage);
	send_item(mageEntity, locate_item("hpot0"), hp_mage + 0);
	send_item(mageEntity, locate_item("mpot0"), mp_mage + 0);
	
	var priestEntity = get_player(priest);
	send_item(priestEntity, locate_item("hpot0"), hp_priest + 0);
	send_item(priestEntity, locate_item("mpot0"), mp_priest + 0);
	
	var warriorEntity = get_player(warrior);
	send_item(warriorEntity, locate_item("hpot0"), hp_warrior + 0);
	send_item(warriorEntity, locate_item("mpot0"), mp_warrior + 0);
}

async function deposit_all()
{	
	await smart_move("bank");	
	
	for (var i = 0; i < 42; i ++)
	{
		if(character.items[i] && !keep_items.includes(character.items[i].name))
			bank_store(i);
	}
}