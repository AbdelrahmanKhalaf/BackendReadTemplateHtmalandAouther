import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IBuyOrder } from '../models/buyorder';
import { IchangeEmail } from '../models/ChangeEmail';
import { IDeleteOrder } from '../models/dataDelete';
import { IUpdateUser } from '../models/dataUpdateUser';
import { IResend } from '../models/emailActivate';
import { IAddWalt } from '../models/IaddWalt';
import { IOrder } from '../models/IOrder';
@Injectable({
  providedIn: 'root'
})
export class ProdactsService {
  constructor(private http: HttpClient) { }

}
