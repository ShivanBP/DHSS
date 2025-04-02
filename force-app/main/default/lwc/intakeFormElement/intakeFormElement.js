import { LightningElement, api } from 'lwc';

export default class IntakeFormElement extends LightningElement {

    @api element;
    @api userInput;
    options = [];

    get isText() {
        return this.element.Data_Type__c === 'Text';
    }

    get isNumber() {
        return this.element.Data_Type__c === 'Number';
    }

    get isCheckbox() {
        return this.element.Data_Type__c === 'Checkbox';
    }

    get isPicklist() {
        return this.element.Data_Type__c === 'Picklist';
    }

    get isRadioGroup() {
        return this.element.Data_Type__c === 'Radio-Group';
    }

    get isTextArea() {
        return this.element.Data_Type__c === 'Text Area';
    }

    get isDualListBox() {
        return this.element.Data_Type__c === 'Dual-Listbox';
    }

    get isAddress() {
        return this.element.Data_Type__c === 'Address';
    }

    get isOutputOnly() {
        return this.element.Data_Type__c === 'Output Only';
    }
    

    connectedCallback() {
        console.log(JSON.stringify(this.element));
        if(this.element.hasOwnProperty('Options__c')) {
            const values = this.element.Options__c.split(';');
            for(let v of values) {
                let option = {};
                option.label = v;
                option.value = v;
                this.options = [...this.options, option];
            }
        }

    }

    handleChange(event) {
        this.userInput = event.detail.value;
    }

    handleCheckboxChange(event) {
        this.userInput = event.target.checked;        
    }

}