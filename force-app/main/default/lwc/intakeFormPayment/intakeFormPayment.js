import { LightningElement, api} from 'lwc';

export default class IntakeFormPayment extends LightningElement {

    @api paymentInstructions = '';

    differentBillingAddress = false;

    handleCheck(event) {
        console.log('Check');
        this.differentBillingAddress = !event.target.checked;
        console.log('this.differentBillingAddres: ' + this.differentBillingAddress);

    }
}