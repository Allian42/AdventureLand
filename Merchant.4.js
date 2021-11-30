load_code("Helper");

//params
var pot_to_buy = 900; 

console.log("merchant");

main();
setInterval(main, 10*60*1000);

async function main()
{
    set_message("main")
    check_server();

	if(is_moving(character)) 
	{
        setTimeout(main,10*1000);
        return;
	}
	
    if(character.rip) 
    {
        respawn(); 
        return;
    } 

    close_stand();
    await smart_move("potions");
    buy_pots();
    send_cm(mage, "magiport pull");
    await my_wait(5*1000);
    distribute_pots();
    send_cm(warrior, "retrieve");
    send_cm(mage, "retrieve");
    send_cm(priest, "retrieve");
    await use_skill("mluck", warrior);
    await use_skill("mluck", mage);
    await use_skill("mluck", priest);
    await my_wait(1000);
    await use_skill("use_town");
    await my_wait(3*1000);
    await smart_move("bank");
    log(1)
    store_all_items();
    await smart_move({map:"main", x:-123, y:23})
    open_stand();
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