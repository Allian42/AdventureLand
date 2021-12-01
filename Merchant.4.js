//params
var pot_to_buy = 900; 
var merchant_interval = 10*60*1000;
var selling_spot = {map:"main", x:-123, y:23};

//startup
load_code("Helper");
console.log("merchant");

//loops
main();
setInterval(main, merchant_interval);

//functions
async function main()
{
    set_message("main")
    close_stand();
    await safe_smart_move("potions");
    buy_pots();
    ask_magiport();
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
    await safe_smart_move("bank");
    store_all_items();
    await safe_smart_move(selling_spot)
    open_stand();
}

async function ask_magiport()
{
    magiport_accepted = false;
    send_cm(mage, "magiport pull");
    while (!magiport_accepted)
        await my_wait(1000);
}

function buy_pots()
{
    buy("hpot1", pot_to_buy - quantity("hpot1"));
	buy("mpot1", pot_to_buy - quantity("mpot1"));
}

function distribute_pots()
{
    send_item(warrior, locate_item("hpot1"), (pot_to_buy/3) - get(warrior + "_hp"));
    send_item(warrior, locate_item("mpot1"), (pot_to_buy/3) - get(warrior + "_mp"));
    send_item(mage, locate_item("hpot1"), (pot_to_buy/3) - get(mage + "_hp"));
    send_item(mage, locate_item("mpot1"), (pot_to_buy/3) - get(mage + "_mp"));
    send_item(priest, locate_item("hpot1"), (pot_to_buy/3) - get(priest + "_hp"));
    send_item(priest, locate_item("mpot1"), (pot_to_buy/3) - get(priest + "_mp"));
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