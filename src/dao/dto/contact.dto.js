export class CreateContactDto{
    constructor(contact){
        this.fullName = `${contact.name} + ${contact.lastName}`
        this.name = contact.first_name;
        this.lastName = contact.last_name;
        this.telefono = contact.telefono;
        this.email = contact.email;
        this.password = contact.password;
    }
}

export class getContactDTO{
    constructor(contactDB){
        this.fullName = contactDB.fullName;
        this.telefono = contactDB.telefono;
        this.email = contactDB.email;
    }
}