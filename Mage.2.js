load_code("Helper");

setInterval(main, 250);
setInterval(background, 5*1000);

async function main()
{
	//actions to wait
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
	
	//solve target
	target = await follow_leader();
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

function background()
{
    set_party();
	register_pot_need("mage_");
	send_to_merchant();	
}