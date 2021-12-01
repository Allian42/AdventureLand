//startup
load_code("Helper");
console.log("mage");

//loops
setInterval(main, interval);
setInterval(ask_party, long_interval);

//functions
async function main()
{	
	loot();	
    regen_hp_mp();
    register_item_need();
	
    let warrior_entity = get_player(warrior);
    let priest_entity = get_player(priest);

    if(!warrior_entity)
        await use_skill("magiport", warrior);

    if(!priest_entity)
        await use_skill("magiport", priest);

    if(!warrior_entity || !priest_entity)
        return;
    
    let target = get_target_of(warrior_entity);    	
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}