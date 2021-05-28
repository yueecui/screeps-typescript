import { Mount } from 'mount/mount';
// 对原型进行扩展
Mount.init();

import { ErrorMapper } from "utils/ErrorMapper";
import { Automatic } from 'utils/Automatic';
import { ManagerCreeps } from 'manager.Creeps';

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
module.exports.loop = () => {
  // console.log(`Current game tick is ${Game.time}`);

  // 自动事务
  Automatic.run();

  // 修改原型
  // prototypeMain.init();

  // 保存bucket
  if (Game.cpu.bucket == 10000){
    Game.cpu.generatePixel();
  }

  // 小虫管理器检查当前单位数量是否正常
  ManagerCreeps.check();

  // 检查所有自己的房间
  for(const name in Game.rooms) {
    const room = Game.rooms[name];
    if (room.controller && room.controller.my){
      room.tickCheck();
    }
  }

  // 运转所有小虫
  for(const name in Game.creeps) {
    Game.creeps[name].run();
  }

  // 临时运转塔
  var tower = Game.getObjectById('60abc165b225d38453b62cde' as Id<StructureTower>);
  if(tower) {
    // var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
    //   filter: (structure) => structure.hits < structure.hitsMax
    // });
    // if(closestDamagedStructure) {
    //   tower.repair(closestDamagedStructure);
    // }
    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if(closestHostile) {
      tower.attack(closestHostile);
    }
  }
};
