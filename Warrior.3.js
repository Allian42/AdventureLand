load_code("Helper");

setInterval(main, 250);

async function main()
{
	if(is_moving(character)) return;
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
	}    
            
    if(!get_party())
    {
        send_party_invite(warrior);
        send_party_invite(mage);
        send_party_invite(priest);
    }

	loot();	
    regen_hp_mp("warrior_");
    
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

character.on("cm",function(data)
{
    if(data.name == mage && data.message == "magiport")
    {
        accept_magiport(mage);
    }

    if(data.name == merchant && data.message == "send stuff")
    {
        send_cm(merchant, { hp:quantity("hpot0"), mp:quantity("mpot0") })
        send_to_merchant();
    }
});

character.on("hit",function(data)
{
    if(!get_targeted_monster())
    {
        change_target(data.target);
    }
});