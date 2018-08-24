import { Directive, Input, Output, EventEmitter } from '@angular/core';
import { HostListener } from '@angular/core';
import { FileIOService } from '../services/filesystem.service';

@Directive({
  selector: '[bh-scan]'
})
export class BHScanDirective {
  @Input() scanOptions;
  @Output() onsuccess: EventEmitter<any> = new EventEmitter();
  @Output() onerror: EventEmitter<any> = new EventEmitter();

  constructor(private fsv: FileIOService) { }

  @HostListener('click') methodToHandleMouseClickAction() {
    this.getPicture()
      .then((sucess) => this.onsuccess.emit(sucess))
      .catch((error) => this.onerror.emit(error));
  }

  getPicture(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.fsv.scanPicture(this.scanOptions).then(res => {
        const options = {
          'formData': res,
          'entityName': this.scanOptions.entityName,
          'metadata': this.scanOptions.metadata
        };
        this.fsv.upload(options).then(uri => {
          resolve(uri);
        }).catch(err => reject(err));
      }).catch((err) => {
        return reject(err);
      });
    });
  }
}
