load_code("Helper");

setInterval(main, 10*60*1000);
main();

async function main()
{
	//actions to wait
	if(is_moving(character)) 
		return;
	
	if(character.rip) 
	{
		setTimeout(respawn,15000);
		return;
	}
	
	close_stand();		
	
	await smart_move("potions");

	buy("hpot0", 300 - quantity("hpot0"));
	buy("mpot0", 300 - quantity("mpot0"));
	
    send_cm(mage,"merchant pull")    
    await new Promise(r => setTimeout(r, 5*1000));    
    await accept_magiport(mage);

    await new Promise(r => setTimeout(r, 5*1000));
    send_cm(warrior, "send stuff")

    await new Promise(r => setTimeout(r, 5*1000));
    send_cm(mage," send stuff")

    await new Promise(r => setTimeout(r, 10*1000));
    await use_skill("use_town");	
	await smart_move("bank");	
	
	for (var i = 0; i < 42; i ++)
	{
		if(character.items[i] && !keep_items.includes(character.items[i].name))
			bank_store(i);
	}
	
	await smart_move("town");
	await smart_move(-123, 23);
	
	open_stand();
}

character.on("cm",function(data)
{
    if(data.name == warrior && data.message.hasOwnProperty('hp'))
    {
        send_item(data.name, locate_item("hpot0"), 100 - data.message.hp);
        send_item(data.name, locate_item("mpot0"), 100 - data.message.mp);
    }
    if(data.name == mage && data.message.hasOwnProperty('hp'))
    {
        send_item(data.name, locate_item("hpot0"), 100 - data.message.hp);
        send_item(data.name, locate_item("mpot0"), 100 - data.message.mp);
    }
});