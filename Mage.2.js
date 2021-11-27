load_code("Helper");

setInterval(main, 250);
setInterval(background, 5*1000);

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
	
    setup_hunting_ground();

    let warrior_entity = get_player(warrior);
    let target = get_target_of(warrior_entity);
    
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

function on_cm(name, data) 
{
    if(name == merchant && data == "merchant pull")
    {
        use_skill("magiport", merchant);
    }
};

function background()
{
    set_party();
	register_pot_need("mage_");
	send_to_merchant();	
}