export class Log {
    id: number = 0;
    type: number = 0;

    message: string = "";

    created_at: Date | string = null;

    constructor(init?: Partial<Log>) {
        Object.keys(this).forEach(key => {
            if (init[key]) {
                this[key] = init[key];
            }
        });

        // Object.assign(this, init);
    }
}