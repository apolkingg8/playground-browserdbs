import React, {useState} from 'react';
import './App.css';
import DumbConfig from "./DumbConfig";
import MySubClassedDexie from "./MySubClassedDexie";
import PouchDB from 'pouchdb'

PouchDB.plugin(require('pouchdb-adapter-indexeddb').default);
PouchDB.plugin(require('pouchdb-find').default)

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
    const [isDbBusy, setIsDbBusy] = useState(false)
    const [costTime, setCostTime] = useState(0)

    return (
        <div className="app">
            <h3>
                DB state: {isDbBusy ? 'BUSY' : 'OK'}
            </h3>
            <h1>
                {isDbBusy ? '?' : costTime} ms
            </h1>
            <div className={'row'}>
                <div className={'col'}>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const dexieDb = new MySubClassedDexie()
                            const dumbArr = generateDumbArr()

                            const st = Date.now()
                            await dexieDb.dumbConfigTable.bulkAdd(dumbArr)
                            setCostTime(Date.now() - st)

                            dexieDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Add 10k items with Dexie (bulk add)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const dexieDb = new MySubClassedDexie()
                            const dumbArr = generateDumbArr()

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                await dexieDb.dumbConfigTable.add(dumbArr[i])
                            }
                            setCostTime(Date.now() - st)

                            dexieDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Add 10k items with Dexie (add * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const dexieDb = new MySubClassedDexie()
                            const dumbArr = generateDumbArr()
                            const keys = dumbArr.map((d)=> (d.id))
                            await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                            const st = Date.now()
                            await dexieDb.dumbConfigTable.bulkDelete(keys)
                            setCostTime(Date.now() - st)

                            dexieDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Delete 10k items with Dexie (bulk delete)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Delete 10k items with Dexie (delete * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Update 10k items with Dexie (bulk update)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Update 10k items with Dexie (update * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const dexieDb = new MySubClassedDexie()
                            const dumbArr = generateDumbArr()
                            const keys = dumbArr.map((d)=> (d.id))
                            await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                            const st = Date.now()
                            const temp = await dexieDb.dumbConfigTable.bulkGet(keys)
                            setCostTime(Date.now() - st)

                            dexieDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Get 10k items by id with Dexie (bulk get)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Get 10k items by id with Dexie (get * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const dexieDb = new MySubClassedDexie()
                            const dumbArr = generateDumbArr()
                            await dexieDb.dumbConfigTable.bulkAdd(dumbArr)

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                await dexieDb.dumbConfigTable.get({
                                    prop1: dumbArr[i].prop1,
                                })
                            }
                            setCostTime(Date.now() - st)

                            dexieDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Get 10k items by indexed prop with Dexie (get * 10k)
                    </button>
                    <button disabled={true}>
                        Get 10k items by non-indexed prop with Dexie (get * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Filter 10k items by indexed prop with Dexie (filter * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Filter 10k items by non-indexed prop with Dexie (filter * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Query 10k items by indexed prop with Dexie (where * 10k)
                    </button>

                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
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
                            setIsDbBusy(false)
                        }}
                    >
                        Query 10k items by non-indexed prop with Dexie (where * 10k)
                    </button>
                </div>
                <div className={'col'}>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()

                            const st = Date.now()
                            await pouchDb.bulkDocs(dumbArr)
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Add 10k items with PouchDB (bulk add)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                await pouchDb.post(dumbArr[i])
                            }
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Add 10k items with PouchDB (add * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            await pouchDb.bulkDocs(dumbArr)

                            const st = Date.now()
                            await pouchDb.bulkDocs(dumbArr.map((d)=> {
                                // @ts-ignore
                                d['_deleted'] = true
                                return d
                            }))
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Delete 10k items with PouchDB (bulk delete)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            await pouchDb.bulkDocs(dumbArr)

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                // @ts-ignore
                                dumbArr[i]['_deleted'] = true
                                await pouchDb.put(dumbArr[i])
                            }
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Delete 10k items with PouchDB (delete * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            await pouchDb.bulkDocs(dumbArr)

                            const st = Date.now()
                            await pouchDb.bulkDocs(dumbArr.map((d)=> {
                                d.prop1 = 'foo'
                                return d
                            }))
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Update 10k items with PouchDB (bulk update)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            await pouchDb.bulkDocs(dumbArr)

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                dumbArr[i].prop1 = 'foo'
                                await pouchDb.put(dumbArr[i])
                            }
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Update 10k items with PouchDB (put * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            const keys = dumbArr.map((d)=> ({
                                id: d.id,
                            }))
                            await pouchDb.bulkDocs(dumbArr)

                            const st = Date.now()
                            await pouchDb.bulkGet({
                                docs: keys,
                            })
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Get 10k items by id with PouchDB (bulk get)
                    </button>
                    {/* https://github.com/pouchdb/pouchdb/issues/8053 */}
                    <button
                        disabled={true}
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            await pouchDb.bulkDocs(dumbArr)
                            await pouchDb.createIndex({
                                index: {
                                    fields: ['prop1']
                                }
                            })

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                const index = Math.floor(Math.random() * dumbArr.length)
                                await pouchDb.find({
                                    selector: {
                                        prop1: dumbArr[index].prop1,
                                    }
                                })
                            }
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Query 10k items by indexed prop with PouchDB (find * 10k)
                    </button>
                    <button
                        onClick={async ()=> {
                            setIsDbBusy(true)
                            await nukeDb()
                            const pouchDb = new PouchDB('myPouchDb', {adapter: 'indexeddb'})
                            const dumbArr = generateDumbArr()
                            await pouchDb.bulkDocs(dumbArr)

                            const st = Date.now()
                            for(let i=0; i<dumbArr.length; i++) {
                                const index = Math.floor(Math.random() * dumbArr.length)
                                await pouchDb.find({
                                    selector: {
                                        prop2: dumbArr[index].prop2,
                                    }
                                })
                            }
                            setCostTime(Date.now() - st)

                            await pouchDb.close()
                            setIsDbBusy(false)
                        }}
                    >
                        Query 10k items by non-indexed prop with PouchDB (find * 10k)
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;
