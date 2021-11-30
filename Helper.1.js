load_code("Snippets");

//params
var server_region = "US"
var server_identifier = "I"
var keep_items = ["hpot0", "mpot0", "stand0"];
var monster_to_hunt = "scorpion";
var warrior = "AllianW"
var merchant = "AllianM"
var mage = "Allian"
var priest = "AllianP"
var interval = 500;
var long_interval = 30*1000;

console.log("helper")
check_server();

const my_wait = time => new Promise(p => setTimeout(p, time));

character.on("stacked",async function(data)
{
    var movement1 = Math.random() * (20 + 20) - 20;
    var movement2 = Math.random() * (20 + 20) - 20;
    move(character.x + movement1, character.y + movement2);
});

character.on("cm",function(data)
{
    if(data.name == merchant && data.message == "retrieve")
    {
        send_to_merchant();
    }

    if(data.name.startsWith("Allian") && data.message == "magiport pull")
    {
        use_skill("magiport", data.name);
    }
});

function on_magiport(name) 
{
    if (name == mage) 
    {
        accept_magiport(name);
    }
}

function on_party_request(name) 
{
    if(name.startsWith("Allian"))
    {
        accept_party_request(name)
    }
}

function check_server()
{
    if(parent.server_region != server_region || parent.server_identifier != server_identifier)
        change_server(server_region, server_identifier);
}

function register_item_need()
{
	set(character.name + "_hp", quantity("hpot0"));
    set(character.name + "_mp", quantity("mpot0"));
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
	if(!is_on_cooldown("regen_hp") && quantity("hpot0") == 0)
		use_skill("regen_hp");
	if(!is_on_cooldown("regen_mp") && quantity("mpot0") == 0)
		use_skill("regen_mp");
    use_hp_or_mp();
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

function handle_death()
{
	setTimeout(respawn,15000);
}