load_code("Helper");

setInterval(main, 250);

async function main()
{
	if(is_moving(character)) 
		return;
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
    }

    let merchant_flag = get("merchant_flag");
    if(!merchant_flag) merchant_flag  = 0;
    
    switch (merchant_flag)
    {
        case 0:
            close_stand();
            set("merchant_flag", merchant_flag + 1);
            break;
        case 1:
            smart_move("potions");
            set("merchant_flag", merchant_flag + 1);
            break;
        case 2:
            buy_pots();
            set("merchant_flag", merchant_flag + 1);
            break;
        case 3:
            send_cm(mage, "magiport pull");
            set("merchant_flag", merchant_flag + 1);
            break;
        case 4:
            if(!get_player(mage))
                break;
            distribute_pots();
            set("merchant_flag", merchant_flag + 1);
            break;
        case 5:
            await use_skill("use_town");
            set("merchant_flag", merchant_flag + 1);
            break;
        case 6:
            smart_move("bank");
            set("merchant_flag", merchant_flag + 1);
            break;
        case 7:
            store_all_items();
            set("merchant_flag", merchant_flag + 1);
            break;
        case 8:
            smart_move({map:"main", x:-123, y:23})
            set("merchant_flag", merchant_flag + 1);
            break;
        case 9:
            open_stand();
            await my_wait(10*60*1000);
            set("merchant_flag", 0);
            break;
        default:
            set("merchant_flag", 0);
            log("error: default case")
            break;
    }
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
		if(character.items[i] && !keep_items.includes(character.items[i].name))
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