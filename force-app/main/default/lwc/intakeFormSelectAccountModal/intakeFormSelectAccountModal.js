import LightningModal from 'lightning/modal';


export default class IntakeFormSelectAccountModal extends LightningModal {

    columns = [
        { label: 'Contact', fieldName: 'name' },
        { label: 'Business Name', fieldName: 'business' },
        { label: 'Address', fieldName: 'address' }
    ];
    
    options = [
        { name: 'Tim', business: 'Tim\'s Agency', address: '123 Main Street' },
        { name: 'Tim', business: 'Tim\'s Client Entity', address: '456 Maple Avenue' }
    ];

    handleOkay() {
        this.close();
    }
}