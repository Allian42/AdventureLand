load_code("Helper");

setInterval(main, 250);

async function main()
{
	if(is_moving(character)) 
	{
		return;
	}
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
	}
    	
	loot();	
	regen_hp_mp("mage_");
	
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
    let warrior_entity = get_player(warrior);
    let target = get_target_of(warrior_entity);

	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

character.on("cm",function(data)
{
    if(data.name == merchant && data.message == "merchant pull")
    {
        use_skill("magiport", merchant);
    }

    if(data.name == merchant && data.message == "send stuff")
    {
        send_cm(merchant, { hp:quantity("hpot0"), mp:quantity("mpot0") })
        send_to_merchant();
    }
});