/*DEFAULT GENERATED TEMPLATE. DO NOT CHANGE SELECTOR TEMPLATE_URL AND CLASS NAME*/
import { Component, AfterViewInit, ViewChild, DoCheck, Input, Output, EventEmitter, HostListener } from '@angular/core'
import * as signing from 'signature_pad';
import { MatSnackBar } from '@angular/material';
/**
* Model import Example :
* import { HERO } from '../models/hero.model';
*/

/**
 * Service import Example :
 * import { HeroService } from '../services/hero/hero.service';
 */

@Component({
    selector: 'bh-bsignature',
    templateUrl: './bsignature.template.html',
    styles: [`
     :host { height: 100% !important; }
     .signature-canvas-fullscreen {
         position: absolute;
         top: 0;
         bottom: 0;
         right: 0;
         left: 0;
     }
     .signature-component-border {
         border: 2px solid black;
     }
    `]
})

export class bsignatureComponent implements AfterViewInit {

    imageDataValue = '';
    private signaturePad: any = '';

    @ViewChild('signaturecanvas') signaturecanvas;
    @ViewChild('canvasparent') canvasparent;

    @Input('backgroundColor') backgroundColor;
    @Input('dotSize') dotSize; // (float or function) Radius of a single dot.
    @Input('minWidth') minWidth; // (float) Minimum width of a line. Defaults to 0.5.
    @Input('maxWidth') maxWidth; // (float) Maximum width of a line. Defaults to 2.5.
    @Input('throttle') throttle; // (integer) Draw the next point at most once per every x milliseconds. Set it to 0 to turn off throttling. Defaults to 16.
    @Input('minDistance') minDistance; // (integer) Add the next point only if the previous one is farther than x pixels. Defaults to 5. 
    @Input('penColor') penColor; // (string) Color used to clear the background. Can be any color format accepted by context.fillStyle. Defaults to "rgba(0,0,0,0)" (transparent black). Use a non-transparent color e.g. "rgb(255,255,255)" (opaque white) if you'd like to save signatures as JPEG images.
    @Input('velocityFilterWeight') velocityFilterWeight; // (float) Weight used to modify new velocity based on the previous velocity. Defaults to 0.7.
    @Input('onBegin') onBegin; // (function) Callback when stroke begin.
    @Input('onEnd') onEnd; // (function) Callback when stroke end.
    @Input('mode') mode = 'responsive'; // 'click-fullscreen' or 'responsive'
    canvasMode = 'responsive'; // 'responsive' or 'fullscreen'
    private savedData;
    private previousSavedData;
    classAbs;

    @Output() imageDataChange = new EventEmitter();
    @Input()
    get imageData() {
        return this.imageDataValue;
    }

    set imageData(val) {
        this.imageDataValue = val;
        this.imageDataChange.emit(this.imageDataValue);
    }

    constructor(private snackbar: MatSnackBar) { }

    ngAfterViewInit() {
        if (this.mode === 'responsive') {
            this.createCanvas();
        }
    }

    createCanvas() {
        this.fitToContainer(this.signaturecanvas.nativeElement);
        this.signaturePad = new signing.default(this.signaturecanvas.nativeElement, this.assignOptions());
    }

    saveCavas() {
        if (this.signaturePad.isEmpty()) {
            this.snackbar.open('Please provide a signature first.', 'OK');
        } else {
            this.imageData = this.signaturePad.toDataURL();
            if (this.mode === 'click-fullscreen') {
                this.savedData = this.signaturePad.toData();
                this.hideCanvas();
            }
        }
    }

    clearCanvas() {
        this.signaturePad.clear();
        // this.fitToContainer(this.signaturecanvas.nativeElement);
    }

    undoCanvas() {
        const data = this.signaturePad.toData();

        if (data) {
            data.pop(); // remove the last dot or line
            this.signaturePad.fromData(data);
        }
    }

    showCanvas() {
        this.classAbs = true;
        this.canvasMode = 'fullscreen';
        if (!this.signaturePad) {
            this.createCanvas();

        }
        this.fitToContainer(this.signaturecanvas.nativeElement, document.body.clientHeight, document.body.clientWidth)
        this.clearCanvas();
        this.createCanvasFromData();
    }

    hideCanvas() {
        this.canvasMode = 'responsive';
    }

    // cancel currently drawn
    cancel() {
        this.savedData = Object.assign([], this.previousSavedData);
    }

    createCanvasFromData() {
        if (this.savedData) {
            this.previousSavedData = Object.assign({}, this.savedData);
            this.signaturePad.fromData(this.savedData);
        }
    }

    private fitToContainer(element, height?, width?) {
        element.style.width = '100%';
        element.style.height = 'calc(100% - 56px)';
        if (height && width) {
            element.width = width;
            element.height = height - 56;
        } else {
            element.width = element.offsetWidth;
            element.height = element.offsetHeight;
        }

    }

    private assignOptions() {
        let options = {};
        options['backgroundColor'] = this.checkIfValidValueAndRGB(this.backgroundColor, 'backgroundColor')
        options['dotSize'] = this.checkIfValidValueAndNumber(this.dotSize, 'dotSize');
        options['minWidth'] = this.checkIfValidValueAndNumber(this.minWidth, 'minWidth');
        options['maxWidth'] = this.checkIfValidValueAndNumber(this.maxWidth, 'maxWidth');
        options['throttle'] = this.checkIfValidValueAndNumber(this.throttle, 'throttle');
        options['minDistance'] = this.checkIfValidValueAndNumber(this.minDistance, 'minDistance');
        options['penColor'] = this.checkIfValidValueAndRGB(this.penColor, 'penColor')
        options['velocityFilterWeight'] = this.checkIfValidValueAndNumber(this.velocityFilterWeight, 'velocityFilterWeight');
        options = JSON.parse(JSON.stringify(options)); // removing all undefined fields
        options['onBegin'] = this.checkIfValidValueAndFunction(this.onBegin, 'onBegin');
        options['onEnd'] = this.checkIfValidValueAndFunction(this.onEnd, 'onEnd');
        return options;
    }

    private checkIfValidValueAndNumber(num, name) {
        if (this.checkIfValid(num) && this.checkNumber(num)) {
            return num;
        }
        this.invalidToast(name, 'num');
        return undefined;
    }

    private checkIfValidValueAndRGB(color, name) {
        if (this.checkIfValid(color) && this.checkRGB(color)) {
            return color;
        }
        this.invalidToast(name, 'rgb');
        return undefined;
    }

    private checkIfValidValueAndFunction(fn, name) {
        if (this.checkIfValid(fn) && this.checkIfValidFunction(fn)) {
            return fn;
        }
        this.invalidToast(name, 'function format');
        return undefined;
    }

    private checkIfValid(value) {
        return (value !== undefined && value !== null) ? value : undefined;
    }

    private checkNumber(num) {
        return !this.checkIsNan(Number(num)) ? Number(num) : undefined;
    }

    private checkIfValidFunction(fn) {
        return typeof fn === 'function' ? fn : undefined;
    }

    private checkRGB(color) {
        const matchColors1 = new RegExp(/rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)/);
        const matchColors2 = new RegExp(/rgb\((\d{1,3}),[ \t]+(\d{1,3}),(\d{1,3})\)/);
        const matchColors3 = new RegExp(/rgb\((\d{1,3}),(\d{1,3}),[ \t]+(\d{1,3})\)/)
        return matchColors1.test(color) || matchColors2.test(color) || matchColors3.test(color);
    }

    private checkIsNan(value) {
        return Number.isNaN(value);
    }

    private invalidToast(optionName, optionType) {
        switch (optionType) {
            case 'num':
                this.snackbar.open(`Invalid ${optionName} (number or float) given, taking default value instead.`, 'OK');
                break;
            case 'rgb':
                this.snackbar.open(`Invalid ${optionName} format Eg: rgb(255, 255, 255)  given, taking default value instead.`, 'OK');
                break;
        }
        return;
    }
}
