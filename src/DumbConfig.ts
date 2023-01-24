import {v4} from "uuid";

export default class DumbConfig {
    id: string = v4()
    prop1: string = v4()
    prop2: string = v4()
    prop3: {
        prop1: string,
        prop2: number
    } = {
        prop1: '.',
        prop2: 1,
    }

    constructor(props: Partial<DumbConfig>) {
        Object.assign(this, props)
    }
}

export {}
