load_code("Helper");

console.log("mage");

setInterval(main, interval);
setInterval(ask_party, long_interval);

async function main()
{
    check_server();

	if(is_moving(character)) 
	{
		return;
	}
	
    if(character.rip) 
    {
        respawn(); 
        return;
    } 
    
	loot();	
    regen_hp_mp();
    register_item_need();
	
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
        return;
    }

    if(!priest_entity)
    {
        use_skill("magiport", priest);
        return;
    }
    
    let target = get_target_of(warrior_entity);    	
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

function ask_party()
{
    if(!character.party)
        send_party_request(warrior)
}