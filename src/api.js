const PlayerAPI = {
    players: [
        {
            id:1, name: 'Jon'
        },
        {
            id:2, name: 'Mike'
        },
        {
            id:3, name: 'Bob'
        },
        {
            id:4, name: 'Jim'
        },
    ],
    all: function(){
        return this.players
    },
    get: function(id){
        return this.players.find(player => player.id === id)
    }
}

export default PlayerAPI;