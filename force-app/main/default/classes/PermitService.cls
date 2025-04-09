public with sharing class PermitService {

    public static Permit__c createPermit(String formIntakeId) {

        //Get intake data
        Form_Intake__c formIntake = getFormIntake(formIntakeId);

        Permit__c permit = new Permit__c();
        permit.RecordTypeId = Schema.SObjectType.Permit__c.getRecordTypeInfosByDeveloperName().get('Permit').getRecordTypeId();

        //Assign static fields
        permit.Permit_Holder__c = formIntake.Account__c;

        Map<String, String> fieldMappings = getFormFieldMapping(formIntake.Form_Name__c);

        for(Form_Answer__c answer : formIntake.Form_Answers__r) {

            if(fieldMappings.containsKey(answer.Question__c)) {
                permit.put(fieldMappings.get(answer.Question__c), answer.Answer__c);                
            }
        }

        insert permit;
        return permit;
    }

    private static Map<String, String> getFormFieldMapping(String formName) {

        Form_Definition__mdt form = getFormDefinition(formName);

        Map<String, String> fieldMappings = new Map<String, String>();

        for(Form_Element__mdt element : form.Form_Elements__r) {
            if(element.Mapped_Field__c != null) {
                fieldMappings.put(element.Question__c, element.Mapped_Field__c);
            }
        }
    
        return fieldMappings;
    }

    public static Form_Definition__mdt getFormDefinition(String formName) {
        return [SELECT Attachments__c, Header__c, Payment_Instructions__c, Side_Panel_Text__c, Footer_Text__c,
                       (SELECT Id, Question__c, Data_Type__c, Options__c, HTML_Code__c, Mapped_Field__c, Required__c FROM Form_Elements__r ORDER BY Order__c),
                       (SELECT Controlling_Field__c, Controlled_Field__c, Action__c FROM Form_Rules__r WHERE Active__c = true)
                FROM Form_Definition__mdt 
                WHERE DeveloperName = :formName 
                LIMIT 1];
    }

    public static Form_Intake__c getFormIntake(String formIntakeId) {
        return [SELECT Id, Form_Name__c, Account__c, Contact__c,
                       (SELECT Id, Question__c, Answer__c FROM Form_Answers__r) 
                FROM Form_Intake__c WHERE Id =: formIntakeId];
    }


}