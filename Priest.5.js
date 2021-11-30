load_code("Helper");

console.log("priest");

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
    if(warrior_entity.hp + character.attack < warrior_entity.max_hp)
        heal(warrior_entity);

    let mage_entity = get_player(mage);
    if(mage_entity.hp + character.attack < mage_entity.max_hp)
        heal(mage_entity);

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