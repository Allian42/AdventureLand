map_key(1, "use_town");

//upgrade pair
map_key(2, "snippet", `
(async () => 
{
    set_message("key2");
    let sucess = true;
    for(let i = 0; i < 26; i++)
    {
        if(!sucess) return;
        let c_item_i = character.items[40].level < character.items[41].level ? 40 : 41;
        let scroll = "scroll" + item_grade(character.items[c_item_i])
        if(quantity(scroll) == 0) await buy(scroll);
        use_skill('massproduction');
        await upgrade(c_item_i,locate_item(scroll)).then(function(data)
        {
            if(!data.success) sucess = false;
        });
    }
})();
`);

map_key(3, "snippet", "pause()");

// for(name in G.monsters)
// {
//     let monster = G.monsters[name];
// 	console.log(name + "," + monster.hp + "," +  monster.mp + "," +  monster.attack + "," +  monster.range + "," +  monster.speed + "," +  monster.frequency + "," +  monster.xp)
// }