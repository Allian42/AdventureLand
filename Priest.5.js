//startup
load_code("Helper");
console.log("priest");

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
    let mage_entity = get_player(mage);

    if(!warrior_entity || !mage_entity)
        return;

    try_heal(warrior_entity);
    try_heal(mage_entity);

    let target = get_target_of(warrior_entity);
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

function try_heal(target)
{
    if(!can_heal(target))
        return;
    if(target.hp + character.attack > target.max_hp)
        return;
    if(target.hp == 0)
        return;
    heal(target);
}