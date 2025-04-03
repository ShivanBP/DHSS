import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import getPath from '@salesforce/apex/IntakeFormController.getPath'
import getForm from '@salesforce/apex/IntakeFormController.getForm';
import submitFormData from '@salesforce/apex/IntakeFormController.submitForm';

import IntakeFormNewAccountModal from 'c/intakeFormNewAccountModal';
import IntakeFormSelectAccountModal from 'c/intakeFormSelectAccountModal';


export default class IntakeForm extends LightningElement {

    selectedForm = '';

    formDefinition;

    currentStep = 1;
    currentStepString = '1'

    hasData = false;

    questionAnswers = [];


    get showHeader() {
        return formDefinition != null;
    }

    get firstStep() {
        return this.currentStep === 1;
    }

    get secondStep() {
        return this.currentStep === 2;
    }

    get thirdStep() {
        return this.currentStep === 3;
    }

    get fourthStep() {
        return this.currentStep === 4;
    }

    get fifthStep() {
        return this.currentStep === 5;
    }

    get isPreviousDisabled() {
        return this.currentStep === 1;
    }

    get showNavigation() {
        return this.currentStep < 5;
    }

    get progressLabel() { 
        return this.currentStep == 4 ? 'Submit' : 'Next';
    }

    @wire(CurrentPageReference)
    currentPageReference;

    async connectedCallback() {
        this.selectedForm = this.currentPageReference.state.c__form; 
        if(this.selectedForm != null) {
            console.log('this.selectedForm:  ' + this.selectedForm);
            this.formDefinition = await getForm({formName: this.selectedForm});
            console.log('this.formDefinition:  ' + JSON.stringify(this.formDefinition));
            this.hasData = true;
        }
    }
    

    async nextStep() {

        switch(this.currentStep){
            case 1:
                break;
            case 2:
                this.readQuestionAnswers();
                break;
            case 3:
                this.submitForm();
                break;
            default:
        }

        this.currentStep++;
        this.currentStepString = this.currentStep.toString();

    }

    previousStep() {
        this.currentStep--;
        this.currentStepString = this.currentStep.toString();
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
        //this.showToast();
    }

    showToast() {
        const event = new ShowToastEvent({
            variant: 'success',
            title: 'Application Submitted',
        });
        this.dispatchEvent(event);
    }

}