import Mount from '@/mount';
// 对原型进行扩展
Mount();

import PeriodicTask from '@/global/periodicTask';
import SpawnManager from '@/spawn/spawnManager';

module.exports.loop = () => {
    // 定期事务
    PeriodicTask();
    // 蚂蚁孵化管理器
    SpawnManager();

    // 检查所有自己的房间
    for(const name in Game.rooms) {
        const room = Game.rooms[name];
        if (room.my){
            room.tickRun();
            // 如果有配置外矿的话，外矿有视野就检查外矿
            for (const name of room.memory.roomConfig.outside){
                if (Game.rooms[name]) Game.rooms[name].tickRun();
            }

            // 临时检查塔
            for (const tower_id of room.towers){
                const tower = Game.getObjectById(tower_id);
                if (tower){
                    const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(closestHostile) {
                        tower.attack(closestHostile);
                        continue
                    }

                    const my_creep = tower.room.find(FIND_MY_CREEPS, {filter: (creep) => {
                        return creep.hits < creep.hitsMax;
                    }});
                    if (my_creep.length){
                        tower.heal(my_creep[0]);
                        continue;
                    }

                    const found = room.find(FIND_MY_STRUCTURES, {filter: (struct) => {
                        return struct.structureType == STRUCTURE_RAMPART && struct.hits < 300;
                    }})
                    if (found.length){
                        tower.repair(found[0]);
                    }
                }
            }
        }
    }

    // 运转所有小虫
    for(const name in Game.creeps) {
        Game.creeps[name].run();
    }

    (global as any).haru.update();
};
