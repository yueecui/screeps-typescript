import { WORK_IDLE, WORK_UPGRADE } from "@/global/constant";


export const roleUpgrader = {
    run: function(creep: Creep) {
        this.updateStatus(creep);
        this.execute(creep);
	},

    // 判断工作模式
    updateStatus: function(creep: Creep){
        switch(creep.work){
            case WORK_UPGRADE:
                break;
            case WORK_IDLE:
                creep.work = WORK_UPGRADE;
                break;
        }
    },

    // 根据工作模式执行
    execute: function(creep: Creep){
        creep.recycleNearby(); // 回收周围的能量

        switch(creep.work){
            case WORK_UPGRADE:
                creep.upgraderDoWork();
                break;
            case WORK_IDLE:
                break;
            default:
                creep.work = WORK_IDLE;
        }
    },
};
