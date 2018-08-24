import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { SystemService } from './system.service';
// import { Http } from '@angular/http';
import { BDataSourceService } from 'app/service/bDataSource.service';
// import {da} from '../../constants/app.const.json';

@Injectable()
export class BDataModelService {

    private systemService: SystemService;
    private dmUrl: string;
    private invalidDataModelName: string = 'Invalid data model name.';
    private invalidDataModelId: string = 'Invalid data model id.';
    private invalidDataModelObj: string = 'Invalid data model object.';
    private dmDs;
    constructor(private http: HttpClient, private dsService: BDataSourceService) {
        this.systemService = new SystemService();
        this.dsService.getDataSource().subscribe(result => {
            this.dmDs = result;
        }, error => {
            console.error(error);
        })
    }

    // GET /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}
    /**
     * 
     * @param dataModelName 
     * @param filter The filter query parameter allows to specify conditions on the documents to return. 
     * The filter qparam value is any mongodb query… Defaults to {}
     * @param keys Projections to be applited on mongo db.
     * @param sort sort to be applied on the query results. Defaults to {}
     * @param pagenumber Page number for paginated queries. Defaults to 1
     * @param pagesize Size of each page to be returned. Defaults to 100.
     */
    get(dataModelName, filter?, keys?, sort?, pagenumber?, pagesize?): Observable<any> {
        if (dataModelName) {
            let modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}`;
            if (this.checkIfValid(keys) || this.checkIfValid(sort) ||
                this.checkIfValid(pagenumber) || this.checkIfValid(pagesize)) {
                let queryString = `${this.toQueryString({
                    'filter': filter,
                    'keys': keys,
                    'sort': sort,
                    'pagenumber': pagenumber,
                    'pagesize': pagesize
                })}`;
                if (queryString === '') {
                    queryString += '?filter={}';
                } else {
                    queryString = '?'.concat(queryString);
                }
                modelNameUrl += queryString;
            }
            return this.http.get(modelNameUrl).map((value, index) => {
                return value;
            }).catch(error => {
                return Observable.throw(error);
            });
        } else {
            return Observable.throw(new Error(`Could not get ${dataModelName}. ${this.invalidDataModelName}`));
        }
    }

    // PUT /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}
    /**
     *
     * @param dataModelName Data model name of the app
     * @param dataModelObj Data Model object which is to be inserted
     */
    put(dataModelName, dataModelObj): Observable<any> {
        if (dataModelName) {
            if (dataModelObj) {
                const modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}`;
                return this.http.put(modelNameUrl, dataModelObj).map((value, index) => {
                    return value;
                }).catch(error => {
                    return Observable.throw(error);
                })
            } else {
                return Observable.throw(new Error(`Could not put ${dataModelObj} in ${dataModelName}. ${this.invalidDataModelObj}`));
            }
        } else {
            return Observable.throw(new Error(`Could not put ${dataModelObj} in ${dataModelName}. ${this.invalidDataModelName}`));
        }
    }

    // DELETE /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}
    /**
     * 
     * @param dataModelName 
     * @param filter 
     */
    delete(dataModelName, filter): Observable<any> {
        let modelNameUrl;
        if (dataModelName) {
            modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}`;
            if (this.checkIfValid(filter) && filter != '') {
                modelNameUrl += `?filter=${filter}`;
            } else {
                modelNameUrl += '?filter={}';
            }
            return this.http.delete(modelNameUrl).map((value, index) => {
                return value;
            }).catch(error => {
                return Observable.throw(error);
            })
        } else {
            return Observable.throw(new Error(`Could not delete ${dataModelName}. ${this.invalidDataModelName}`));
        }
    }

    // PATCH /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}
    /**
     * 
     * @param dataModelName Data model name which is to be updated
     * @param dataModelObj New data model object
     */
    update(dataModelName, updateObject): Observable<any> {
        if (dataModelName && updateObject) {
            const modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}`;
            return this.http.patch(modelNameUrl, updateObject).map((value, index) => {
                return value;
            }).catch(error => {
                return Observable.throw(error);
            })
        } else {
            return Observable.throw(new Error(`Could not update ${dataModelName}. ${this.invalidDataModelName}`));
        }
    }

    // GET /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}/{dataModelId}
    /**
     * 
     * @param dataModelName Data model name which is to be updated
     * @param dataModelId Data model id which is to be updated
     */
    getById(dataModelName, dataModelId): Observable<any> {
        if (dataModelName) {
            if (dataModelId) {
                const modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}/${dataModelId}`;
                return this.http.get(modelNameUrl).map((value, index) => {
                    return value;
                }).catch(error => {
                    return Observable.throw(error);
                })
            } else {
                Observable.throw(new Error(`Could not get ${dataModelName} by id ${dataModelId}. ${this.invalidDataModelId}`));
            }
        } else {
            Observable.throw(new Error(`Could not get ${dataModelName} by id ${dataModelId}. ${this.invalidDataModelName}`));
        }
    }

    // DELETE /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}/{dataModelId}
    /**
     * 
     * @param dataModelName Data model name which is to be deleted
     * @param dataModelId Data model id which is to be deleted
     */
    deleteById(dataModelName, dataModelId) {
        if (dataModelName) {
            if (dataModelId) {
                const modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}/${dataModelId}`;
                return this.http.delete(modelNameUrl).map((value, index) => {
                    return value;
                }).catch(error => {
                    return Observable.throw(error);
                })
            } else {
                Observable.throw(new Error(`Could not get ${dataModelName} by id ${dataModelId}. ${this.invalidDataModelId}`));
            }
        } else {
            return Observable.throw(new Error(`Could not delete ${dataModelName} by id ${dataModelId}. ${this.invalidDataModelName}`));
        }
    }

    //PATCH /{tenantName}/datamodel/{datasource}/{appName}/{dataModelName}/{dataModelId}
    /**
     * 
     * @param dataModelName Data model name which is to be update
     * @param dataModelId Data model id which is to be updated
     * @param dataModelObj Data Model object which is to be inserted
     */
    updateById(dataModelName, dataModelId, dataModelObj) {
        if (dataModelName) {
            if (dataModelId) {
                const modelNameUrl = `${this.getDataSourceURL(dataModelName)}${dataModelName}/${dataModelId}`;
                var dmObj = Object.assign({}, dataModelObj);
                delete dmObj['_id'];
                return this.http.patch(modelNameUrl, dmObj).map((value, index) => {
                    return value;
                }).catch(error => {
                    return Observable.throw(error);
                })
            } else {
                Observable.throw(new Error(`Could not get ${dataModelName} by id ${dataModelId}. ${this.invalidDataModelId}`));
            }
        } else {
            return Observable.throw(new Error(`Could not delete ${dataModelName} by id ${dataModelId}. ${this.invalidDataModelName}`));
        }
    }

    private toQueryString(obj) {
        const parts = [];
        for (const i in obj) {
            if (obj.hasOwnProperty(i) && this.checkIfValid(obj[i])) {
                parts.push((i) + '=' + JSON.stringify(obj[i]));
            }
        }
        return parts.join('&');
    }

    private checkIfValid(value: any) {
        if (value === undefined || value == null) {
            return false;
        } else {
            return true;
        }
    }

    private getDataSourceURL(dataModelName) {
        const dsDm = this.dmDs['dataSource'][dataModelName];
        const properties = this.systemService.properties;
        if (dsDm) {
            return properties.baseUrl + properties.tenantName + '/datamodel/' + dsDm + '/' + properties.appName + '/';
        } else {
            return this.systemService.getDataModelUrl();
        }
    }

}

