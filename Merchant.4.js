load_code("Helper");

setInterval(main, 250);

async function main()
{
    check_server();

	if(is_moving(character)) 
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
            set("merchant_flag", "buy_pots");
            break;
        case "buy_pots":
            buy_pots();
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
            set("merchant_flag", "close");
            log("error: default case")
            break;
    }
}

function buy_items()
{
    let list_items = ["blade", "staff", "wshield", "helmet", "chest", "gloves", "pants", "shoes"];

    for (const item of list_items) 
    {
        if(quantity(item) == 0)
            buy(item);
    }
}

function buy_scrolls()
{
    buy("scroll0", 8 - quantity("scroll0"));
}

function buy_pots()
{
    buy("hpot0", 300 - quantity("hpot0"));
	buy("mpot0", 300 - quantity("mpot0"));
}

function distribute_pots()
{
    send_item(warrior, locate_item("hpot0"), 100 - get("warrior_hp"));
    send_item(warrior, locate_item("mpot0"), 100 - get("warrior_mp"));
    send_item(mage, locate_item("hpot0"), 100 - get("mage_hp"));
    send_item(mage, locate_item("mpot0"), 100 - get("mage_mp"));
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