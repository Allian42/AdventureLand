load_code("Helper");

console.log("mage");

setInterval(main, interval);

async function main()
{
    check_server();

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
    equip_better_items();
    register_item_need("mage_");
    send_to_merchant();
	
    let warrior_entity = get_player(warrior);
    let priest_entity = get_player(priest);

    if(!get_nearest_monster({type:monster_to_hunt}))
    {
        await smart_move(monster_to_hunt);
        return;
    }    

    if(!warrior_entity)
    {
        use_skill("magiport", warrior);
        send_cm(warrior, "magiport");
        return;
    }

    if(!priest_entity)
    {
        use_skill("magiport", priest);
        send_cm(priest, "magiport");
        return;
    }
    
    let target = get_target_of(warrior_entity);    	
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

character.on("cm",function(data)
{
    if(data.name.startsWith("Allian") && data.message == "magiport pull")
    {
        use_skill("magiport", data.name);
    }
});

function on_party_invite(name) 
{
    if(name.startsWith("Allian"))
    {
        accept_party_invite(name)
    }
}