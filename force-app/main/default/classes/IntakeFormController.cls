public without sharing class IntakeFormController {

    @AuraEnabled
    public static Form_Definition__mdt getForm(String formName) {
        return PermitService.getFormDefinition(formName);
    }

    @AuraEnabled
    public static void submitForm(String formName, List<Object> incomingQuestionAnswers) {

        String hardCodedAccountId = '001O800000eDFvFIAW';
        String hardCodedContactId = '003O800000hDYL3IAO';

        Form_Intake__c formIntake = new Form_Intake__c(Form_Name__c = formName, Account__c = hardCodedAccountId, Contact__c = hardCodedContactId);
        insert formIntake;

        if(incomingQuestionAnswers != null) {

            List<QuestionAnswer> questionAnswers = (List<QuestionAnswer>)JSON.deserialize(JSON.serialize(incomingQuestionAnswers), List<QuestionAnswer>.class);
            
            List<Form_Answer__c> formAnswers = new List<Form_Answer__c>();

            for(QuestionAnswer qna : questionAnswers) {
                formAnswers.add(new Form_Answer__c(Form_Intake__c = formIntake.Id, Question__c = qna.question, Answer__c = qna.answer));
            }

            if(formAnswers.size() > 0) {
                insert formAnswers;
            }

        }

        PermitService.createPermit(formIntake.Id);

    }


    
    public class QuestionAnswer {
        public String question {get;set;}
        public String answer {get;set;}
    }
    
}