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

    get showDocumentsStep() {
        return this.currentStep === 'Documents';
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

            this.hasData = true;
            
        }

    }

    applyFormRules() {       

        this.readQuestionAnswers();

        for(let formRule of this.formDefinition.Form_Rules__r) {
            var controllingFieldData = this.questionAnswers.find(qa => qa.id === formRule.Controlling_Field__c);

            console.log('formRule: ' + JSON.stringify(formRule));
            console.log('controllingFieldData: ' + JSON.stringify(controllingFieldData));

            this.template.querySelectorAll('[data-input=true]').forEach(component => {

                console.log()

                if(component.element.Id == formRule.Controlled_Field__c) {

                    switch(formRule.Action__c){
                        case 'Show on true':
                            component.showOnTrue(controllingFieldData.answer);
                            break;
                        case 'Hide on true':
                            component.hideOnTrue(controllingFieldData.answer);
                            break;
                        default:
                    }
                }
    
            });
    
        }

    }
    

    async nextStep() {

        //Actions to take before moving to next step
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

    }

    previousStep() {
        this.currentIndex = this.pathSteps.indexOf(this.currentStep);
        this.currentStep = this.pathSteps[this.currentIndex - 1];
    }

    async handleSelectBusiness() {
        const result = await IntakeFormSelectAccountModal.open();
    }

    async handleNewBusiness() {
        const result = await IntakeFormNewAccountModal.open();
    }

    //This method stores the question answers
    readQuestionAnswers() {

        this.questionAnswers = [];

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

                this.questionAnswers.push({ question: component.element.Question__c, answer: answer, id: component.element.Id });

            }
        });
    }

    async submitForm() {
        await submitFormData({ formName: this.selectedForm, incomingQuestionAnswers: this.questionAnswers });
    }

}