import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

import getForm from '@salesforce/apex/IntakeFormController.getForm';
import getFormPath from '@salesforce/apex/IntakeFormController.getFormPath';
import submitFormData from '@salesforce/apex/IntakeFormController.submitForm';

import IntakeFormNewAccountModal from 'c/intakeFormNewAccountModal';
import IntakeFormSelectAccountModal from 'c/intakeFormSelectAccountModal';


export default class IntakeForm extends LightningElement {

    selectedForm = '';

    hasData = false;

    questionAnswers = [];

    formDefinition;

    formAttachments = [];

    questionAnswers = [];

    pathSteps = [];
    currentStep = '';
    currentIndex = 1;

    hasData = false;

    get showAccountInformationStep() {
        return this.currentStep === 'Account Information';
    }

    get showPermitApplicationStep() {
        return this.currentStep === 'Permit Application';
    }

    get showUploadAttachmentsStep() {
        return this.currentStep === 'Upload Attachments';
    }

    get showReviewAndSignStep() {
        return this.currentStep === 'Review & Signature';
    }

    get showPaymentStep() {
        return this.currentStep === 'Payment';
    }

    get showConfirmationStep() {
        return this.currentStep === 'Confirmation';
    }

    get showNavigation() {
        return !this.showConfirmationStep;
    }

    get progressLabel() { 
        return this.showReviewAndSignStep ? 'Submit' : 'Next';
    }

    @wire(CurrentPageReference)
    currentPageReference;

    async connectedCallback() {
        this.selectedForm = this.currentPageReference.state.c__form; 
        if(this.selectedForm != null) {
            this.formDefinition = await getForm({formName: this.selectedForm});
            if(this.formDefinition.Attachments__c != null) {
                this.formAttachments = this.formDefinition.Attachments__c.split(';');
            }
            this.pathSteps = await getFormPath({formName: this.selectedForm});
            this.currentStep = this.pathSteps[0];
            console.log('this.pathSteps:  ' + JSON.stringify(this.pathSteps));
            this.hasData = true;
        }
    }
    

    async nextStep() {

        console.log('this step: ' + this.currentStep);

        switch(this.currentStep){
            case 'Permit Application':
                this.readQuestionAnswers();
                break;
            case 'Review & Signature':
                this.submitForm();
                break;
            default:
        }

        this.currentIndex = this.pathSteps.indexOf(this.currentStep);
        this.currentStep = this.pathSteps[this.currentIndex + 1];



        console.log('front step: ' + this.currentStep);

    }

    previousStep() {

        console.log('this step: ' + this.currentStep);

        this.currentIndex = this.pathSteps.indexOf(this.currentStep);
        this.currentStep = this.pathSteps[this.currentIndex - 1];

        console.log('back step: ' + this.currentStep);
    }

    async handleSelectBusiness() {
        const result = await IntakeFormSelectAccountModal.open();
    }

    async handleNewBusiness() {
        const result = await IntakeFormNewAccountModal.open();
    }

    //This method stores the question answers
    readQuestionAnswers() {

        this.template.querySelectorAll('[data-input=true]').forEach(component => {

            if(component.element.Data_Type__c != 'Output Only') {

                let answer;

                if(component.element.Data_Type__c == 'Checkbox') {
                    answer = component.userInput ? "Yes" : "No";
                } else if(component.element.Data_Type__c == 'Dual-Listbox') {
                    if(component.userInput != null && component.userInput.length > 0) {
                        answer = component.userInput.join('; ');
                    }
                } else {
                    answer = component.userInput;
                }

                this.questionAnswers.push({question: component.element.Question__c, answer: answer});

            }
        });
    }

    async submitForm() {
        await submitFormData({ formName: this.selectedForm, incomingQuestionAnswers: this.questionAnswers });
    }

}