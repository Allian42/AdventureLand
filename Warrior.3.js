load_code("Helper");

setInterval(main, 250);

async function main()
{
    check_server();
    
	if(is_moving(character)) return;
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
	}    
            
    send_party_invites();    
	loot();	
    regen_hp_mp("warrior_");
    equip_better_items();
    register_item_need("warrior_");
    send_to_merchant();
    
	let target = get_targeted_monster();
    if(!target)
    {
        target = get_nearest_monster({type:monster_to_hunt});
    }
    
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

function send_party_invites()
{
    let mage_entity = get_player(mage);
    if(mage_entity && !mage_entity.party)
    {
        send_party_invite(mage);
    }
}

character.on("cm",function(data)
{
    if(data.name == mage && data.message == "magiport")
    {
        accept_magiport(mage);
    }
});

character.on("hit",function(data)
{
    if(!get_targeted_monster())
    {
        change_target(data.target);
    }
});