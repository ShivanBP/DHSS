import { LightningElement, api } from 'lwc';
import IntakeFormNewAccountModal from 'c/intakeFormNewAccountModal';
import IntakeFormSelectAccountModal from 'c/intakeFormSelectAccountModal';


export default class IntakeFormStaticFields extends LightningElement {

    @api showControls = false;

    async handleSelectBusiness() {
        const result = await IntakeFormSelectAccountModal.open();
    }

    async handleNewBusiness() {
        const result = await IntakeFormNewAccountModal.open();
    }
}