import { CreateContactDto,getContactDTO } from "../dao/dto/contact.dto";

export class ContractRepository{
    constructor(dao){
        this.dao = dao;
    }
    async getContacts(){
        const contacts = await this.dao.get();
        return contacts;
    }
    async createContact(contact){
        const contactDto = new CreateCon
    }
}