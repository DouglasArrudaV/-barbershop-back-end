import { uuid } from "uuidv4";

const { v4: uuidv4 } = require('uuid');


class Appointment {
    id: string;

    provider: string;

    date: Date;

    constructor({provider, date}: Omit<Appointment, 'id'>) {
        this.id = uuidv4()
        this.provider = provider;
        this.date = date;
    }
}

export default Appointment;