import { LightningElement, api } from 'lwc';

export default class Panel extends LightningElement {
    @api title = 'Form Info';
    @api body = ''
    @api position = 'right';
    @api size = 'medium';
    @api open = false;
    @api customHeader = false;
    @api hideHeader = false;
    @api fullHeight = false;

    get panelClass(){
        return `slds-panel slds-size_${this.size} slds-panel_docked ${this.position === 'left' ? ' slds-panel_docked-left ' : ' slds-panel_docked-right '} ${this.open ? ' slds-is-open ' : ''} ${this.fullHeight ? ' full-height ' : ''}` ;
    }
    get displayHeader(){
        return !this.hideHeader && !this.customHeader;
    }
    get closed(){
        return !this.open;
    }

    handleOpenClick() {
        this.open = true;
    }

    handleCloseClick(){
        this.dispatchEvent(new CustomEvent('close'));
        this.open = false;
    }
    
}