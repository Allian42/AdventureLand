//startup
load_code("Helper");
console.log("warrior");

//loops
setInterval(main, interval);
setInterval(ask_party, long_interval);

//functions
async function main()
{	               
	loot();	
    regen_hp_mp();
    register_item_need();
    
    let mage_entity = get_player(mage);
    let priest_entity = get_player(priest);

    if(!mage_entity || !priest_entity)
        return;
    
    if(!is_on_cooldown("charge"))
        use_skill("charge");

    let target = pick_target();    
	if(target)
	{
		close_target_distance(target);	
	    try_attack(target);
    }
}

function pick_target()
{
    let target = undefined;
    for(id in parent.entities)
    {        
        let monster = parent.entities[id];

        if(monster.type != "monster")
            continue;

        if(monster.target != warrior)
            continue;

        if(!target)
        {
            target = monster;
            continue;
        }

        if(monster.hp < target.hp)
        {
            target = monster;
            continue;
        }
    }
    
    if(!target)
        target = get_nearest_monster({type:monster_to_hunt});

    return target;
}

//events
game.on("hit",function(data)
{
    if(data.target == mage || data.target == priest || data.target == merchant)
    {
        console.log(data);
        let monster = parent.entities[data.actor];
        if(!is_on_cooldown("taunt"))
            use_skill("taunt", monster);
    }
});