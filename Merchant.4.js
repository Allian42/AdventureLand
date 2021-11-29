load_code("Helper");

//params
var pot_to_buy = 900;

console.log("merchant");

set("flag_upgrade", 0);
set("merchant_flag", "close");

setInterval(main, interval);

async function main()
{
    check_server();

	if(is_moving(character)) 
        return;
        
    if(character.q.upgrade)
        return;
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
    }

    let merchant_flag = get("merchant_flag");
    if(!merchant_flag) merchant_flag  = "close";
    
    switch (merchant_flag)
    {
        case "close":
            close_stand();
            set("merchant_flag", "move_potions");
            break;
        case "move_potions":
            smart_move("potions");
            set("merchant_flag", "buy_pots");
            break;            
        case "buy_pots":
            buy_pots();
            set("merchant_flag", "buy_items");
            break;
        case "buy_items":
            buy_items();
            set("merchant_flag", "move_scrolls");
            break;
        case "move_scrolls":
            smart_move("scrolls");
            set("merchant_flag", "buy_scrolls");
            break;
        case "buy_scrolls":
            buy_scrolls();
            set("merchant_flag", "move_upgrade");
            break;
        case "move_upgrade":
            smart_move("upgrade");
            set("merchant_flag", "do_upgrade");
            break;
        case "do_upgrade":
            await do_upgrade();
            if(get("flag_upgrade") < list_gear.length)
                break;
            set("flag_upgrade", 0);
            set("merchant_flag", "ask_magiport");
            break;
        case "ask_magiport":
            send_cm(mage, "magiport pull");
            set("merchant_flag", "distribute_pots");
            break;
        case "distribute_pots":
            if(!get_player(mage))
                break;
            distribute_pots();
            set("merchant_flag", "distribute_items");
            break;
        case "distribute_items":
            distribute_items();
            await my_wait(5*1000);
            set("merchant_flag", "return_town");
            break;
        case "return_town":
            await use_skill("use_town");
            set("merchant_flag", "move_bank");
            break;
        case "move_bank":
            smart_move("bank");
            set("merchant_flag", "store_items");
            break;
        case "store_items":
            store_all_items();
            set("merchant_flag", "move_selling_spot");
            break;
        case "move_selling_spot":
            smart_move({map:"main", x:-123, y:23})
            set("merchant_flag", "setup_shop");
            break;
        case "setup_shop":
            open_stand();
            await my_wait(10*60*1000);
            set("merchant_flag", "close");
            break;
        default:
            set("flag_upgrade", 0);
            set("merchant_flag", "close");
            log("error: default case")
            break;
    }
}

function buy_pots()
{
    buy("hpot0", pot_to_buy - quantity("hpot0"));
	buy("mpot0", pot_to_buy - quantity("mpot0"));
}

function buy_items()
{
    for (const gear of list_gear) 
    {
        if(quantity(gear) == 0)
            buy(gear);
    }
}

function buy_scrolls()
{
    if(quantity("scroll0") < list_gear.length)
        buy("scroll0", list_gear.length - quantity("scroll0"));
}

async function do_upgrade()
{
    let flag_upgrade = get("flag_upgrade");
    if(!flag_upgrade) flag_upgrade = 0;
    await upgrade(locate_item(list_gear[flag_upgrade]), locate_item("scroll0"));
    set("flag_upgrade", flag_upgrade + 1);
}

async function async_upgrade(item)
{
    await upgrade(locate_item(item), locate_item("scroll0")).then(function(data){ log(data.success) });
}

function distribute_pots()
{
    send_item(warrior, locate_item("hpot0"), (pot_to_buy/3) - get("warrior_hp"));
    send_item(warrior, locate_item("mpot0"), (pot_to_buy/3) - get("warrior_mp"));
    send_item(mage, locate_item("hpot0"), (pot_to_buy/3) - get("mage_hp"));
    send_item(mage, locate_item("mpot0"), (pot_to_buy/3) - get("mage_mp"));
    send_item(priest, locate_item("hpot0"), (pot_to_buy/3) - get("priest_hp"));
    send_item(priest, locate_item("mpot0"), (pot_to_buy/3) - get("priest_mp"));
}

function distribute_items()
{
    send_gear(warrior, "warrior_mainhand", "blade");
    send_gear(warrior, "warrior_offhand", "wshield");
    send_gear(warrior, "warrior_helmet", "helmet");
    send_gear(warrior, "warrior_coat", "coat");
    send_gear(warrior, "warrior_gloves", "gloves");
    send_gear(warrior, "warrior_pants", "pants");
    send_gear(warrior, "warrior_shoes", "shoes");

    send_gear(mage, "mage_mainhand", "wand");
    send_gear(mage, "mage_helmet", "helmet");
    send_gear(mage, "mage_coat", "coat");
    send_gear(mage, "mage_gloves", "gloves");
    send_gear(mage, "mage_pants", "pants");
    send_gear(mage, "mage_shoes", "shoes");

    send_gear(priest, "priest_mainhand", "staff");
    send_gear(priest, "priest_offhand", "wshield");
    send_gear(priest, "priest_helmet", "helmet");
    send_gear(priest, "priest_coat", "coat");
    send_gear(priest, "priest_gloves", "gloves");
    send_gear(priest, "priest_pants", "pants");
    send_gear(priest, "priest_shoes", "shoes");
}

function send_gear(reciever, flag, item)
{
    let gear_i = locate_item(item)
    if(gear_i == -1)
        return;
    let gear = character.items[gear_i];
    if(gear && get(flag) < gear.level)
        send_item(reciever, gear_i);
}

function store_all_items()
{
    for (var i = 0; i < 42; i ++)
	{
        let item = character.items[i];
		if(item && !keep_items_deposit.includes(item.name))
			bank_store(i);
	}
}

function on_magiport(name) 
{
    if (name == mage) 
    {
        accept_magiport(name);
    }
}