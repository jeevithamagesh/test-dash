import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SystemService } from 'app/service/system.service';

declare const window: any;
declare const cordova: any;
declare const navigator: any;
declare const scan: any;

@Injectable()
export class FileIOService {
  systemService;
  appProperties;

  constructor(private http: HttpClient) {
    this.systemService = new SystemService();
    this.appProperties = this.systemService.getVal('properties');
  }

  private getFileInfo(options): any {
    let dataModelURL = this.systemService.getDataModelUrl();
    if (options.metadata) {
      dataModelURL += `${this.appProperties.appName}_${options.entityName}.files?filter={"metadata.key": "${options.metadata.key}"}`;
    } else {
      dataModelURL += `${this.appProperties.appName}_${options.entityName}.files/${options.fileId}`;
    }
    return this.http.get(dataModelURL);
  }

  private getFormData(fileUri: string): Promise<FormData> {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(fileUri, (fileEntry) => {
        fileEntry.file((file) => {
          const reader = new FileReader();
          reader.onerror = evt => {
            return reject(evt);
          };
          reader.onloadend = evt => {
            const formData = new FormData();
            const blob = new Blob([new Uint8Array(reader.result)], { type: file.type });
            formData.append('file', blob, file.name);
            return resolve(formData);
          };
          reader.readAsArrayBuffer(file);
        });
      }, (error) => {
        return reject(error);
      });
    });
  }

  public getPicture(cameraOptions) {
    return new Promise((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        navigator.camera.getPicture((imageUri) => {
          this.getFormData(imageUri).then(res => {
            return resolve(res);
          }).catch(err => reject(err));
        }, (error) => {
          return reject(error);
        }, cameraOptions);
      }, false);
    });
  }

  public scanPicture(scanOptions) {
    return new Promise((resolve, reject) => {
      document.addEventListener('deviceready', () => {
        if(scanOptions.hasOwnProperty('sourceType')) {
          scan.scanDoc(scanOptions.sourceType, (imageUri) => {
            this.getFormData(imageUri).then(res => {
              return resolve(res);
            }).catch(err => reject(err));
          }, (error) => {
            return reject(error);
          });
        } else {
          reject('sourceType not found');
        }
      }, false);
    });
  }

 public upload(options): Promise<any> {
    return new Promise((resolve, reject) => {
      let body: FormData = new FormData();
      if (options.formData) {
        body = options.formData;
      } else if (options.files) {
        body.append('file', options.files);
      } else {
        reject('No file selected!');
      }
      if (options.metadata) {
        body.append('metadata', JSON.stringify(options.metadata));
      }

      const headers = { 'Content-Type': 'null' };

      const url = this.systemService.getFileIOUrl() + `${options.entityName}`;

      this.http.post(url, body, { headers: this.setHeaders(headers) })
        .subscribe(res => resolve(res)
        , err => reject(err));
    });
  }

  public download(options: any): Promise<any> {
    return new Promise((resolve, reject) => {
      if (options.entityName && (options.metadata || options.fileId)) {
        this.getFileInfo(options).subscribe((res) => {
          if (options.metadata) {
            res = res[res.length - 1];
          } else {
            res = res.result;
          }
          const fileInfo = {
            contentType: '',
            filename: ''
          };
          if (res && res['contentType'] && res['filename']) {
            fileInfo['contentType'] = res['contentType'];
            fileInfo['filename'] = res['filename'];
            let fileIOURL = this.systemService.getFileIOUrl();
            if (options.metadata) {
              fileIOURL += `${options.entityName}?metadataFilter={"metadata.key": "${options.metadata.key}"}`;
            } else {
              fileIOURL += `${options.entityName}/${options.fileId}`;
            }
            const headers = {
              'Accept': fileInfo.contentType
            };
            this.http.get(fileIOURL, { headers: this.setHeaders(headers), responseType: 'blob' }).subscribe((response: any) => {
              const blob = new Blob([response.body], { type: fileInfo.contentType });
              this.saveFile(blob, fileInfo.filename).then((resp) => {
              }).catch(err => reject(err));
            }, err => reject(err));
          } else {
            reject('fileInfo not exit');
          }
        }, err => reject(err));
      } else {
        return reject('download options not found');
      }
    });
  }

  private saveFile(data: Blob, filename: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.systemService.checkDevice() == 'mobile') {
        const storageLocation = this.systemService.isAndroid() ? cordova.file.externalRootDirectory : cordova.file.documentsDirectory;
        this.createDirectory(storageLocation, this.appProperties.appName, filename, data)
          .then(res => resolve(res))
          .catch(err => reject(err));
      } else {
        this.saveToBrowser(data, filename).then(res => resolve(res));
      }
    });
  }

  private saveToBrowser(data: Blob, fileName: string) {
    return new Promise((resolve) => {
      // Edge 20+
      const isEdge = !(/*@cc_on!@*/false || !!document['documentMode']) && !!window.StyleMedia;
      if (isEdge) {
        window.navigator.msSaveBlob(data, fileName);
      } else {
        const downloadURL = window.URL.createObjectURL(data);
        const anchor = document.createElement('a');
        document.body.appendChild(anchor);
        anchor.style.display = 'none';
        anchor.download = fileName;
        anchor.href = downloadURL;
        anchor.click();
        window.URL.revokeObjectURL(downloadURL);
        document.body.removeChild(anchor);
        anchor.remove();
      }
      return resolve('download complete');
    });
  }

  private createDirectory(rootDirectory: any, appName: string, fileName: string, data: Blob) {
    return new Promise((resolve, reject) => {
      window.resolveLocalFileSystemURL(rootDirectory, (fileSystem) => {
        fileSystem.getDirectory(appName, { create: true }, (dirEntry) => {
          this.checkFileExist(dirEntry.nativeURL, fileName, 0, (newFileName) => {
            dirEntry.getFile(newFileName, { create: true }, (targetFile) => {
              targetFile.createWriter((fileWriter) => {
                fileWriter.onwriteend = () => {
                  return resolve(targetFile.toURL());
                };

                fileWriter.onerror = (err) => {
                  return reject(err);
                };
                fileWriter.write(data);
              });
            });
          });
        }, err => reject(err));
      }, err => reject(err));
    });
  }

  private checkFileExist = (path: string, fileName: string, i: number, callback) => {
    return window.resolveLocalFileSystemURL(path + fileName, () => {
      let length = 4;
      if (fileName.lastIndexOf('(') > -1) {
        const isExist = parseInt(fileName.slice((fileName.lastIndexOf('(') + 1), fileName.lastIndexOf(')')), 10);
        if (!isNaN(isExist)) {
          i = isExist + 1;
          if (i > 10 && i < 100) {
            length += 1;
          } else if (i > 100) {
            length += 2;
          }
          fileName = fileName.slice(0, (fileName.lastIndexOf('.') - length)) + ' (' + i + ')' + fileName.slice(fileName.lastIndexOf('.'));
        } else {
          i += 1;
          fileName = fileName.slice(0, (fileName.lastIndexOf('.'))) + fileName.slice(fileName.lastIndexOf('.'));
          fileName = fileName.slice(0, (fileName.lastIndexOf('.'))) + ' (' + i + ')' + fileName.slice(fileName.lastIndexOf('.'));
        }
      } else {
        i += 1;
        fileName = fileName.slice(0, (fileName.lastIndexOf('.'))) + fileName.slice(fileName.lastIndexOf('.'));
        fileName = fileName.slice(0, (fileName.lastIndexOf('.'))) + ' (' + i + ')' + fileName.slice(fileName.lastIndexOf('.'));
      }
      return this.checkFileExist(path, fileName, i, callback);
    }, () => {
      return callback(fileName);
    });
  }

  private setHeaders(headerJSON: Object): HttpHeaders {
    let headers = new HttpHeaders();
    for (const key in headerJSON) {
      if (key) {
        headers = headers.set(key, headerJSON[key]);
      }
    }
    return headers;
  }

}
