public without sharing class IntakeFormController {

    @AuraEnabled
    public static Form_Definition__mdt getForm(String formName) {

        //TODO: Get labels in a separate array and reference that on the front end
        return [SELECT Id, Header__c, Payment_Instructions__c, Side_Panel_Text__c, Footer_Text__c,
                        (SELECT Question__c, Data_Type__c, Options__c, HTML_Code__c, Required__c FROM Form_Elements__r) 
                FROM Form_Definition__mdt 
                WHERE DeveloperName = :formName 
                LIMIT 1];
                
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

    }
    
    public class QuestionAnswer {
        public String question {get;set;}
        public String answer {get;set;}
    }

}