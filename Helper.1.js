//params
var server_region = "US"
var server_identifier = "I"
var keep_items = ["hpot1", "mpot1", "stand0"];
var monster_to_hunt = "scorpion";
var warrior = "AllianW"
var merchant = "AllianM"
var mage = "Allian"
var priest = "AllianP"
var interval = 0.25*1000;
var long_interval = 30*1000;
var magiport_accepted = false;

//startup
load_code("Snippets");
check_server();
console.log("helper")


//events
character.on("stacked",async function(data)
{
    var movement1 = Math.random() * (20 + 20) - 20;
    var movement2 = Math.random() * (20 + 20) - 20;
    await move(character.x + movement1, character.y + movement2);
});

character.on("cm",async function(data)
{
    if(data.name == merchant && data.message == "retrieve")
    {
        send_to_merchant();
    }

    if(data.name.startsWith("Allian") && data.message == "magiport pull")
    {
        while(character.mp < 900 || is_on_cooldown("magiport"))
            await my_wait(1000);
        use_skill("magiport", data.name);
    }
});

function on_magiport(name) 
{
    if (name == mage) 
    {
        accept_magiport(name);
        magiport_accepted = true;
    }
}

function on_party_request(name) 
{
    if(name.startsWith("Allian"))
    {
        accept_party_request(name)
    }
}

function handle_death()
{
    if(character.rip)
	    setTimeout(respawn,15000);
}

//functions
const my_wait = time => new Promise(p => setTimeout(p, time));

function check_server()
{
    if(parent.server_region != server_region || parent.server_identifier != server_identifier)
        change_server(server_region, server_identifier);
}

function ask_party()
{
    if(!character.party)
        if(character.name == warrior)
            send_party_request(mage)
        else 
            send_party_request(warrior);
}

function register_item_need()
{
	set(character.name + "_hp", quantity("hpot1"));
    set(character.name + "_mp", quantity("mpot1"));
}

async function safe_smart_move(destination)
{
    smart_move(destination);
    while(is_moving(character))
    {
        await my_wait(1000);
    }
}

function send_to_merchant()
{
    send_gold(merchant, character.gold);
    for (var i = 0; i < 42; i ++)
    {
        let item = character.items[i];
        if(item && !keep_items.includes(item.name))
            send_item(merchant,i,item.q);
    }
}

function regen_hp_mp()
{
    if(is_on_cooldown("use_hp")) 
        return;

    let hp_ratio = character.hp/character.max_hp;
    let mp_ratio = character.mp/character.max_mp;
    
	if(hp_ratio<0.5) use_skill('use_hp');
    else if(mp_ratio<0.5) use_skill('use_mp'); 
    else if(hp_ratio<0.9) use_skill('regen_hp'); 
    else if(mp_ratio<0.9) use_skill('regen_mp'); 
}

async function close_target_distance(target)
{
	if(in_attack_range(target))
	{
        return;
    }

    var moveX = character.x+(target.x-character.x)/2
    var moveY = character.y+(target.y-character.y)/2    
    await move(moveX,moveY);
}

function try_attack(target)
{
	if(!can_attack(target) || character.mp < character.mp_cost)
        return;
        
    change_target(target);
    attack(target);	
}