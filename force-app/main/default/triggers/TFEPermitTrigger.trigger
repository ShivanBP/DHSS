trigger TFEPermitTrigger on Permit__c (after insert,before insert, before update,after update,before delete) {

  // Trigger for After Insert
    /*if (Trigger.isInsert && Trigger.isAfter) {
        System.debug('Start TFEPermitTrigger : AfterInsert');
        TFEPermitTriggerHandler.onAfterInsert(Trigger.new);
        System.debug('End TFEPermitTrigger : AfterInsert');
    }
 
    // Trigger for After update
    if (Trigger.isAfter && Trigger.isUpdate) {
        System.debug('Start TFEPermitTrigger : AfterUpdate');
        TFEPermitTriggerHandler.onAfterUpdate(Trigger.new);
        System.debug('End TFEPermitTrigger : AfterUpdate');
    }    
    
     // Trigger for before update
    if (Trigger.isBefore && Trigger.isUpdate) {
        System.debug('Start TFEPermitTrigger : BeforeUpdate');
        TFEPermitTriggerHandler.onBeforeUpdate(Trigger.new, Trigger.oldMap);
        System.debug('End TFEPermitTrigger : BeforeUpdate');
    }    
    
    // Trigger for before Delete
    if (Trigger.isDelete && Trigger.isbefore) {
        System.debug('Start TFEPermitTrigger : BeforeDelete');
        TFEPermitTriggerHandler.onBeforeDelete(Trigger.old);
        System.debug('End TFEPermitTrigger : BeforeDelete');
    } */
    
    
}