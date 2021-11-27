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
	
	await buy_pots();
	
	await move_to_hunting_grounds();
	
	await give_pots();
	
	await new Promise(r => setTimeout(r, 5*1000));
	
	await deposit_all();
	
	await smart_move("main");
	await smart_move(-123, 23);
	
	open_stand();
}