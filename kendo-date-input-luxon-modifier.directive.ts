import {
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Self,
    SimpleChanges
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import compare from 'just-compare';
import { DateInputComponent } from '@node_modules/@progress/kendo-angular-dateinputs';
import { DateTimeService } from '@app/shared/common/timing/date-time.service';

@Directive({
    selector: '[kendoDateInputLuxonModifier]'
})
export class KendoDateInputLuxonModifierDirective implements OnDestroy, OnChanges, OnInit {
    @Input() date: DateTime;
    @Output() dateChange = new EventEmitter<DateTime>();

    @Input() maxDate?: DateTime;
    @Input() minDate?: DateTime;
    subscribe: Subscription;
    lastDate: Date = null;

    constructor(
        @Self() private kendoDateInput: DateInputComponent,
        private _dateTimeService: DateTimeService) {

    }

    ngOnInit(): void {
        this.subscribe = this.kendoDateInput.valueChange
            .subscribe((date: Date) => {
                if (!date) {
                    this.lastDate = null;
                    this.dateChange.emit(null);
                } else if ((date instanceof Date && !compare(this.lastDate, date) && date.toString() !== 'Invalid Date')) {
                    this.lastDate = date;
                    this.dateChange.emit(DateTime.fromJSDate(date));
                }
            });
    }

    ngOnDestroy() {
        this.subscribe.unsubscribe();
    }

    ngOnChanges({ date }: SimpleChanges) {
        if (this.date) {
            if (date && date.currentValue && !compare(date.currentValue, date.previousValue)) {
                if (date.currentValue instanceof DateTime) {
                    this.kendoDateInput.value = date.currentValue.toJSDate();
                } else {
                    let year = date.currentValue.getFullYear();
                    let month = date.currentValue.getMonth();
                    let day = date.currentValue.getDate();
                    this.kendoDateInput.value = this._dateTimeService.createJSDate(year, month, day);
                }
            }
        }
        if (this.maxDate) {
            this.kendoDateInput.max = this.maxDate.toJSDate();
        }
        if (this.minDate) {
            this.kendoDateInput.min = this.minDate.toJSDate();
        }
    }
}
