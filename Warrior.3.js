load_code("Helper");

setInterval(main, 250);
setInterval(background, 5*1000);

async function main()
{
	if(is_moving(character)) return;
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
	}    
    		
	loot();	
	regen_hp_mp("warrior_");
	
	let target = await warrior_target();
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}
character.on("cm",function(data)
{
    if(name == mage && data == "magiport")
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

function background()
{
    set_party();
	register_pot_need("warrior_");
	send_to_merchant();	
}