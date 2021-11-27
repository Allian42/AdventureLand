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
	
	buy_pots();
	
    send_cm(mage,"merchant pull")
    
    await new Promise(r => setTimeout(r, 5*1000));
    
    accept_magiport(mage);

    await new Promise(r => setTimeout(r, 10*1000));
	
    give_pots();
    
    await use_skill("use_town");
	
	await deposit_all();
	
	await smart_move("main");
	await smart_move(-123, 23);
	
	open_stand();
}