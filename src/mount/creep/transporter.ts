import {
    ENERGY_NEED, ENERGY_ENOUGH,
    WORK_IDLE, WORK_TRANSPORTER_SPAWN, WORK_TRANSPORTER_TOWER, WORK_TRANSPORTER_STORAGE,
    TASK_WAITING, TASK_ACCEPTED,
    CONTAINER_TYPE_SOURCE,
    WORK_TRANSPORTER_CONTROLLER,
} from '@/constant';

export const creepExtensionTransporter = function () {
    // ------------------------------------------------------
    // 孵化能量搬运
    // ------------------------------------------------------

    // 检查是否需要设置工作状态为搬运孵化能量
    Creep.prototype.checkWorkTransporterSpawn = function(){
        if (this.getWorkState() != WORK_TRANSPORTER_SPAWN
            && this.room.hasUnqueueTaskSpawn()){
            // 设定工作状态
            this.clearQueue();
            this.clearTarget();
            this.setWorkState(WORK_TRANSPORTER_SPAWN);
            this.acceptTaskSpawn();
            return true;
        }
        return false;
    }

    // 执行WORK_TRANSPORTER_SPAWN
    Creep.prototype.doWorkTransporterSpawn = function(){
        if (this.getEnergyState() == ENERGY_NEED){
            this.obtainEnergy({
                container: [CONTAINER_TYPE_SOURCE],
                storage: true,
            });
        }else{
            // 没有找到下个目标的情况下，返回false，并且把工作置为IDLE
            if (!this.setNextTarget()){
                this.setWorkState(WORK_IDLE);
                return;
            }
            const target = this.getTargetObject() as AnySpawnEnergyStoreStructure;
            // 目标如果不存在（被拆除）或是目标已经满了
            // 就跳过该目标
            if (!target || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                delete this.room.memory.taskSpawn[this.memory.t!];
                this.clearTarget();
            }
            if (this.store.getFreeCapacity() > 0 && (target.store.getFreeCapacity(RESOURCE_ENERGY) > this.store[RESOURCE_ENERGY])){
                this.setEnergyState(ENERGY_NEED);
                this.obtainEnergy({
                    container: [CONTAINER_TYPE_SOURCE],
                    storage: true,
                });
            }else{
                const result = this.transfer(target, RESOURCE_ENERGY);
                switch(result){
                    case OK:
                        // 如果容量能填满则任务完成，否则不能清除目标还得继续运能量来填
                        if (this.store[RESOURCE_ENERGY] >= target.store.getFreeCapacity(RESOURCE_ENERGY)){
                            delete this.room.memory.taskSpawn[this.memory.t!];
                            this.clearTarget();
                        }
                        break;
                    case ERR_NOT_IN_RANGE:
                        this.moveTo(target);
                        break;
                }
            }

        }
    }

    // ------------------------------------------------------
    // 塔能量搬运
    // ------------------------------------------------------

    // 检查是否需要设置工作状态为搬运孵化能量
    Creep.prototype.checkWorkTransporterTower = function(){
        if (this.getWorkState() != WORK_TRANSPORTER_TOWER
            && this.room.hasUnqueueTaskTower()){
            // 设定工作状态
            this.clearQueue();
            this.clearTarget();
            this.setWorkState(WORK_TRANSPORTER_TOWER);
            this.acceptTaskSpawn();
            return true;
        }
        return false;
    }

    // 执行WORK_TRANSPORTER_TOWER
    Creep.prototype.doWorkTransporterTower = function(){
        if (this.getEnergyState() == ENERGY_NEED){
            this.obtainEnergy({
                storage: true,
            });
        }else{
            // 没有找到下个目标的情况下，返回false，并且把工作置为IDLE
            if (!this.setNextTarget()){
                this.setWorkState(WORK_IDLE);
                return;
            }
            const target = this.getTargetObject() as StructureTower;
            // 目标如果不存在（被拆除）或是目标已经满了
            // 就跳过该目标
            if (target == null || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                delete this.room.memory.taskTowers[this.memory.t!];
                this.clearTarget();
            }
            if (this.store.getFreeCapacity() > 0 && (target.store.getFreeCapacity(RESOURCE_ENERGY) > this.store[RESOURCE_ENERGY])){
                this.setEnergyState(ENERGY_NEED);
                this.obtainEnergy({
                    storage: true,
                });
            }else{
                const result = this.transfer(target, RESOURCE_ENERGY);
                switch(result){
                    case OK:
                        // 如果容量能填满则任务完成，否则不能清除目标还得继续运能量来填
                        if (this.store[RESOURCE_ENERGY] >= target.store.getFreeCapacity(RESOURCE_ENERGY)){
                            delete this.room.memory.taskTowers[this.memory.t!];
                            this.clearTarget();
                        }
                        break;
                    case ERR_NOT_IN_RANGE:
                        this.moveTo(target);
                        break;
                }
            }
        }
    }

    // ------------------------------------------------------
    // 给controller container补充能量
    // ------------------------------------------------------

    // 检查
    Creep.prototype.checkWorkTransporterController = function(){
        if (this.getWorkState() != WORK_TRANSPORTER_CONTROLLER){
            const empty_containers = this.room.getEmptyControllerContainers();
            if (empty_containers.length > 0){
                // 设定工作状态
                this.clearQueue();
                this.setTarget(empty_containers[0].id);
                if (this.store.getFreeCapacity() == 0){
                    this.setEnergyState(ENERGY_ENOUGH);
                }else{
                    this.setEnergyState(ENERGY_NEED);
                }
                this.setWorkState(WORK_TRANSPORTER_CONTROLLER);
                return true;
            }
        }
        return false;
    }

    // 执行 WORK_TRANSPORTER_CONTROLLER
    Creep.prototype.doWorkTransporterController = function(){
        if (this.getEnergyState() == ENERGY_NEED){
            this.obtainEnergy({
                container: [CONTAINER_TYPE_SOURCE],
                storage: true,
            })
        }else{
            const target = this.getTargetObject() as StructureContainer | null;
            // 目标如果不存在（被拆除）或是目标已经满了
            // 就跳过该目标
            if (target == null || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                this.clearTarget();
                this.setWorkState(WORK_IDLE);
                return;
            }
            if (this.store[RESOURCE_ENERGY] == 0){
                this.setEnergyState(ENERGY_NEED);
                this.obtainEnergy({
                    container: [CONTAINER_TYPE_SOURCE],
                    storage: true,
                });
            }else{
                const result = this.transfer(target, RESOURCE_ENERGY);
                switch(result){
                    case OK:
                        this.setWorkState(WORK_IDLE);
                        break;
                    case ERR_NOT_IN_RANGE:
                        this.moveTo(target);
                        break;
                }
            }
        }
    }

    // ------------------------------------------------------
    // source container转存到storage
    // ------------------------------------------------------

    // 检查是否需要设置工作状态为搬运孵化能量
    Creep.prototype.checkWorkTransporterStorage = function(){
        if (this.getWorkState() != WORK_TRANSPORTER_STORAGE && this.room.storage){
            const full_containers = this.room.getFullSourceContainers();
            if (full_containers.length > 0){
                // 设定工作状态
                this.clearQueue();
                if (this.store.getFreeCapacity() == 0){
                    this.setEnergyState(ENERGY_ENOUGH);
                }else{
                    this.setEnergyState(ENERGY_NEED);
                }
                this.setEnergyTarget(full_containers[0].id);
                this.setWorkState(WORK_TRANSPORTER_STORAGE);
                return true;
            }
        }
        return false;
    }

    // 执行 WORK_TRANSPORTER_STORAGE
    Creep.prototype.doWorkTransporterStorage = function(){
        if (this.getEnergyState() == ENERGY_NEED){
            // 只从energy target中获取
            this.obtainEnergy({
                storage: false,
            })
        }else{
            const target = this.room.storage;
            // 目标如果不存在（被拆除）或是目标已经满了
            // 就跳过该目标
            if (target == null || target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
                this.clearTarget();
                this.setWorkState(WORK_IDLE);
                return;
            }
            const result = this.transfer(target, RESOURCE_ENERGY);
            switch(result){
                case OK:
                    this.setWorkState(WORK_IDLE);
                    break;
                case ERR_NOT_IN_RANGE:
                    this.moveTo(target);
                    break;
            }
        }
    }
}
