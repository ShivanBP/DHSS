import { LightningElement, api } from 'lwc';
import Logo_Delaware_Bedding from '@salesforce/resourceUrl/Logo_Delaware_Bedding';


export default class IntakeFormHeader extends LightningElement {

    @api headerText = '';
    logoUrl = Logo_Delaware_Bedding;
    
    connectedCallback() {
        console.log('>>headerText: ' + JSON.stringify(this.headerText));
    }

}