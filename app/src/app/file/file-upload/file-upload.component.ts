import { Component, Input, Output, EventEmitter, ViewChild, Renderer2 } from '@angular/core';
import { FileIOService } from '../services/filesystem.service';

@Component({
  selector: 'bh-file-upload',
  styleUrls: ['./file-upload.component.scss'],
  templateUrl: './file-upload.component.html',
})
export class BHFileUploadComponent {
  @ViewChild('fileInput') fileInput;
  file: File;
  fileName;
  isDone: boolean;

  @Input() uploadOptions;
  @Output() onsuccess: EventEmitter<any> = new EventEmitter<any>();
  @Output() onerror: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fileIOService: FileIOService,
    private _renderer: Renderer2) { }

  /**
   * Method executed when upload button is clicked.
   */
  handleUpload(): void {
    this.isDone = false;
    if (this.file && this.uploadOptions && this.uploadOptions.entityName && this.uploadOptions.metadata) {
      this.fileIOService.upload({ files: this.file, entityName: this.uploadOptions.entityName, metadata: this.uploadOptions.metadata })
        .then((res) => {
          this.isDone = true;
          this.onsuccess.emit(res);
        })
        .catch(err => this.onerror.emit(err));
    } else {
      this.onerror.emit(new Error('Upload options missing'));
    }
  }

  /**
   * Method executed when a file is selected.
   */
  handleSelect(fileInput: any): void {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.file = fileInput.target.files[0];
      this.fileName = this.file.name;
    }
  }

  /**
   * Methods executed when cancel button is clicked.
   * Clears files.
   */
  cancel(): void {
    this.file = null;
    this.fileName = null;
    this.isDone = false;
    // check if the file input is rendered before clearing it
    if (this.fileInput) {
      this._renderer.setProperty(this.fileInput, 'value', '');
    }
  }

}
