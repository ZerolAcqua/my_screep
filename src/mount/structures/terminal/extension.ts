/**
 * @description
 * 自定义的 Terminal 的拓展
 */
export default class TerminalExtension extends StructureTerminal {  
    /**
     * 运作
     */
    public work(): void {
    }

    /**
     * 回调 - 建造完成
     * 分配职责
     */
    public onBuildComplete(): void {
        this.room.memory.terminalId=this.id
    }
}
