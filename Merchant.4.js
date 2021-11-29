load_code("Helper");

//params
var pot_to_buy = 900;
set("merchant_flag", "close");

console.log("merchant");

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
            set("merchant_flag", "ask_items");
            break;
        case "ask_items":
            send_cm(warrior, "retrieve");
            send_cm(mage, "retrieve");
            send_cm(priest, "retrieve");
            await my_wait(10*1000);
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

function distribute_pots()
{
    send_item(warrior, locate_item("hpot0"), (pot_to_buy/3) - get(warrior + "_hp"));
    send_item(warrior, locate_item("mpot0"), (pot_to_buy/3) - get(warrior + "_mp"));
    send_item(mage, locate_item("hpot0"), (pot_to_buy/3) - get(mage + "_hp"));
    send_item(mage, locate_item("mpot0"), (pot_to_buy/3) - get(mage + "_mp"));
    send_item(priest, locate_item("hpot0"), (pot_to_buy/3) - get(priest + "_hp"));
    send_item(priest, locate_item("mpot0"), (pot_to_buy/3) - get(priest + "_mp"));
}

function store_all_items()
{
    for (var i = 0; i < 42; i ++)
	{
        let item = character.items[i];
		if(item && !keep_items.includes(item.name))
			bank_store(i);
	}
}