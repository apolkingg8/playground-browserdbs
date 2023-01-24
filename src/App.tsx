import React, {useState} from 'react';
import './App.css';
import DumbConfig from "./DumbConfig";
import MySubClassedDexie from "./MySubClassedDexie";

const nukeDb = async ()=> {
    const dbs = await window.indexedDB.databases()
    dbs.forEach(db => { window.indexedDB.deleteDatabase(db.name || '') })
}

const generateDumbArr = (): DumbConfig[] => {
    const dumbArr: DumbConfig[] = []

    for(let i=0; i<10*1000; i++) {
        const dumb = new DumbConfig({})
        dumbArr.push(dumb)
    }

    return dumbArr
}

function App() {
    const [dbState, setDbState] = useState('ok')
    const [costTime, setCostTime] = useState(0)

    return (
        <div className="app">
            <div>
                DB state: {dbState}
            </div>
            <h1>
                {costTime} ms
            </h1>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()

                    const st = Date.now()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Add 10k items with Dexie (bulk add)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        await dexieDb.dumbConfigTable.add(dumbArr[i])
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Add 10k items with Dexie (add * 10k)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    const keys = dumbArr.map((d)=> (d.id))
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    await dexieDb.dumbConfigTable.bulkDelete(keys)
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Delete 10k items with Dexie (bulk delete)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        await dexieDb.dumbConfigTable.delete(dumbArr[i].id)
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Delete 10k items with Dexie (delete * 10k)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    let dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    dumbArr = dumbArr.map((dumbConfig)=> {
                        return new DumbConfig({
                            id: dumbConfig.id,
                            prop1: `new ${dumbConfig.prop1}`
                        })
                    })

                    const st = Date.now()
                    await dexieDb.dumbConfigTable.bulkPut(dumbArr)
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Update 10k items with Dexie (bulk update)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        const newDumb = new DumbConfig({
                            id: dumbArr[i].id,
                            prop1: `new ${dumbArr[i].prop1}`
                        })
                        await dexieDb.dumbConfigTable.update(dumbArr[i].id, newDumb)
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Update 10k items with Dexie (update * 10k)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    const keys = dumbArr.map((d)=> (d.id))
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    const temp = await dexieDb.dumbConfigTable.bulkGet(keys)
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Get 10k items by key with Dexie (bulk get)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        await dexieDb.dumbConfigTable.get(dumbArr[i].id)
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Get 10k items by key with Dexie (get * 10k)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        const index = Math.floor(Math.random() * dumbArr.length)
                        const temp = await dexieDb.dumbConfigTable.filter((dumb)=> {
                            return dumb.prop1 === dumbArr[index].prop1
                        })
                        await temp.raw()
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Filter 10k items by indexed prop with Dexie (filter * 10k)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        const index = Math.floor(Math.random() * dumbArr.length)
                        const temp = await dexieDb.dumbConfigTable.filter((dumb)=> {
                            return dumb.prop2 === dumbArr[index].prop2
                        })
                        await temp.raw()
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Filter 10k items by non-indexed prop with Dexie (filter * 10k)
            </button>
            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        const index = Math.floor(Math.random() * dumbArr.length)
                        const temp = dexieDb.dumbConfigTable.where('prop1').equals(dumbArr[index].prop1)
                        await temp.raw()
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Query 10k items by indexed prop with Dexie (where * 10k)
            </button>

            <button
                onClick={async ()=> {
                    setDbState('busy')
                    await nukeDb()
                    const dexieDb = new MySubClassedDexie()
                    const dumbArr = generateDumbArr()
                    await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                    const st = Date.now()
                    for(let i=0; i<dumbArr.length; i++) {
                        const index = Math.floor(Math.random() * dumbArr.length)
                        const temp = dexieDb.dumbConfigTable.where('prop2').equals(dumbArr[index].prop2)
                        await temp.raw()
                    }
                    setCostTime(Date.now() - st)

                    dexieDb.close()
                    setDbState('ok')
                }}
            >
                Query 10k items by non-indexed prop with Dexie (where * 10k)
            </button>
        </div>
    );
}

export default App;
