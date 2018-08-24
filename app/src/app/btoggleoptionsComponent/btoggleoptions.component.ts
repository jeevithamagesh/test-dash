import { MatSnackBar } from '@angular/material';
import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core'

@Component({
    selector: 'bh-btoggleoptions',
    templateUrl: './btoggleoptions.template.html'
})

export class btoggleoptionsComponent implements OnInit, OnChanges {
    // options = {icon: 'home', value: 'home', disabled: false, 'checked': false}
    @Input('toggleOptions') toggleOptions = [];
    @Input('align') align = 'horizontal';
    @Input('disabledIndex') disabledIndex;
    @Input('checkedIndex') checkedIndex;
    @Output() indexChange = new EventEmitter();
    @Output() valueChange = new EventEmitter();
    constructor(private snackbar: MatSnackBar) {
    }

    ngOnInit() {
        if (this.checkNumber(this.checkedIndex)) {
            this.checkedIndex = Number(this.checkedIndex);
        }

        if (this.checkNumber(this.disabledIndex)) {
            this.disabledIndex = Number(this.disabledIndex);
        }

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['checkedIndex'] && this.checkNumber(this.checkedIndex)) {
            this.checkedIndex = Number(this.checkedIndex);
        } else if (changes['disabledIndex'] && this.checkNumber(this.disabledIndex)) {
            this.disabledIndex = Number(this.disabledIndex);
        }
    }

    optionClicked(index) {
        if (this.toggleOptions && this.toggleOptions.length > 0) {
            this.indexChange.emit(index);
            if (this.toggleOptions[index] && this.toggleOptions[index].value) {
                this.valueChange.emit(this.toggleOptions[index].value);
            } else {
                this.snackbar.open('Invalid toggle button value', 'OK');
            }
        } else {
            this.snackbar.open('Invalid toggle options', 'OK');
        }
    }

    private checkNumber(number) {
        if (number !== undefined && number !== null) {
            return Number.isNaN(Number(number));
        }
        return false;
    }
}
