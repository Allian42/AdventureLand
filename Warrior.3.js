load_code("Helper");

console.log("warrior");

setInterval(main, interval);

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
    
    if(!is_on_cooldown("charge"))
    {
        use_skill("charge");
    }
               
	loot();	
    regen_hp_mp();
    register_item_need();
    
	let target = get_targeted_monster();
    if(!target)
    {
        target = get_nearest_monster({type:monster_to_hunt});
    }
    
	if(target)
	{
        if(!is_on_cooldown("taunt"))
        {
            use_skill("taunt", target);
        }
		close_target_distance(target);	
	    try_attack(target);
    }
}

character.on("hit",function(data)
{
    if(!get_targeted_monster())
    {
        change_target(data.target);
    }
});