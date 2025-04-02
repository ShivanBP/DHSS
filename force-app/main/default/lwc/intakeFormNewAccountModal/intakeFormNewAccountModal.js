import LightningModal from 'lightning/modal';

export default class IntakeFormNewAccountModal extends LightningModal {

    handleOkay() {
        this.close();
    }
}