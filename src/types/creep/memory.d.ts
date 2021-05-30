interface CreepMemory {
  /**
   * Creep的职责(Role)
   */
  r: ANY_ROLE_NAME;
  /**
   * Creep的能量持有状态，只有具备CARRY模块的才有该属性
   */
  e: ENERGY_STATUS;
  /**
   * Creep的工作状态
   */
  w: WORK_STATUS;
  /**
   * Creep当前的工作目标队列
   */
  queue: Id<any>[] | null;
  /**
   * Creep当前的工作目标
   */
  t: Id<any> | null;
  /**
   * Creep当前的能量目标
   */
  et?: Id<AnyStoreStructure> | null;
  /**
   * 采集者记录采集点编号
   */
  node: number;
  /**
   * Creep的模式
   *
   * 不同类型的模式不同
   */
  mode: ANY_CREEP_MODE;
  /**
   * 指定站着的位置
   */
  flag?: string;
  /**
   * 指定站着的位置
   */
  stay?: [number, number];
}


type ENERGY_STATUS =
    | ENERGY_NEED
    | ENERGY_ENOUGH;

type ENERGY_NEED = 0;
type ENERGY_ENOUGH = 1;

type WORK_STATUS =
     | WORK_GOTO
     | WORK_IDLE
     | WORK_TRANSPORTER_SPAWN
     | WORK_TRANSPORTER_TOWER
     | WORK_TRANSPORTER_CONTROLLER
     | WORK_TRANSPORTER_STORAGE_MINERAL
     | WORK_TRANSPORTER_STORAGE_ENERGY
     | WORK_HARVEST_ENERGY
     | WORK_HARVEST_MINERAL
     | WORK_UPGRADE
     | WORK_BUILD
     | WORK_REPAIR;

type WORK_GOTO = -1
type WORK_IDLE = 0;
type WORK_TRANSPORTER_SPAWN = 1;
type WORK_TRANSPORTER_TOWER = 2;
type WORK_TRANSPORTER_CONTROLLER = 3;
type WORK_TRANSPORTER_STORAGE_MINERAL = 9;
type WORK_TRANSPORTER_STORAGE_ENERGY = 10;
type WORK_UPGRADE = 12;
type WORK_BUILD = 13;
type WORK_REPAIR = 14;
type WORK_HARVEST_ENERGY = 21;
type WORK_HARVEST_MINERAL = 22;

type ANY_CREEP_MODE =
    | MODE_NONE
    | MODE_SPAWN
    | MODE_CONTROLLER
    | MODE_BUILDER
    | MODE_REPAIRER;

// 无模式
type MODE_NONE = -1;
// 搬运者的模式
type MODE_HARVEST_ENERGY = 0;
type MODE_HARVEST_MINERAL = 1;
// 搬运者的模式
type MODE_SPAWN = 0;
type MODE_CONTROLLER = 1;
// 建造者的模式
type MODE_BUILDER = 0;
type MODE_REPAIRER = 1;
