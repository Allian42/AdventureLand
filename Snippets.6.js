//upgrade pair
map_key(2, "snippet", `
(async () => 
{
    set_message("key2");
    let sucess = true;
    for(let i = 0; i < 26; i++)
    {
        if(!sucess) return;
        let c_item_i = character.items[39].level < character.items[40].level ? 39 : 40;
        use_skill('massproduction');
        await upgrade(c_item_i,41).then(function(data)
        {
            if(!data.success) sucess = false;
        });
    }
})();
`);