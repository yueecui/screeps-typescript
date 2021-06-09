/**
 * 将蚂蚁设为“回收”，其会自动回到Spawn被回收掉
 */
export const roleGoToRecycle = {
    run: function(creep: Creep) {
        this.execute(creep);
	},

    // 判断工作模式
    updateStatus: function(creep: Creep){
    },

    // 根据工作模式执行
    execute: function(creep: Creep){
        creep.recycleNearby(); // 回收周围的能量

        let target;
        if (creep.room.name == 'W35N57' || creep.room.name == 'W34N57'){
            target = Game.spawns['Ironforge'];
        }else if (creep.room.name == 'W41N54'){
            target = Game.spawns['Beijing'];
        }else{
            target = Game.spawns['Shanghai'];
        }

        creep.say('♻️');
        if (creep.pos.isNearTo(target)){
            target.recycleCreep(creep);
        }else{
            creep.moveTo(target);
        }
    },
};
