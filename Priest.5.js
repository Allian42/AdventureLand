load_code("Helper");

console.log("priest")

setInterval(main, 250);

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
    regen_hp_mp("priest_");
    equip_better_items();
    register_item_need("priest_");
    send_to_merchant();
	
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
    if(data.name == mage && data.message == "magiport")
    {
        accept_magiport(mage);
    }
});

function on_party_invite(name) 
{
    if(name.startsWith("Allian"))
    {
        accept_party_invite(name)
    }
}