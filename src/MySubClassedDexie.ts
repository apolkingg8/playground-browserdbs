import {Dexie, Table} from "dexie";
import DumbConfig from "./DumbConfig";

export default class MySubClassedDexie extends Dexie {
    // 'friends' is added by dexie when declaring the stores()
    // We just tell the typing system this is the case

    dumbConfigTable!: Table<DumbConfig>;

    constructor() {
        super('myDexieDb')
        this.version(1).stores({
            dumbConfigTable: '&id, prop1' // Primary key and indexed props
        })
    }
}
