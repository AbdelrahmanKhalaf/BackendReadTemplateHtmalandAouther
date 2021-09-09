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
  allProdactes(page: any, limit: any) {
    return this.http.get(`${environment.url}/prodact/getAll?page=${page}&&limit=${limit}`)
  }
  saleProdactes() {
    return this.http.get(`${environment.url}/prodact/sale`)
  }
  ProdactesbySale(id: any) {
    return this.http.get(`${environment.url}/prodact/sale/${id}`)
  }
  ProdactesbyCateg(id: any) {
    return this.http.get(`${environment.url}/prodact/getByIdCategory/${id}`)
  }
  filterProdactsPrice(price: any) {
    return this.http.get(`${environment.url}/prodact/get?price=${price}`)
  }
  filterProdactsLtAndGt(gt: any, lt: any) {
    return this.http.get(`${environment.url}/prodact/get?gt=${gt}&&lt=${lt}`)
  }
  filterProdactsSale(sale: any) {
    return this.http.get(`${environment.url}/prodact/get?sale=${sale}`)
  }
  filterProdactsAttribute(attribute: any, value: any) {
    return this.http.get(`${environment.url}/prodact/get?attribute=${attribute}&&value=${value}`)
  }
  filterProdacts(attribute: any, value: any, sale: any, categories: any) {
    return this.http.get(`${environment.url}/prodact/get?attribute=${attribute}&&value=${value}&&sale=${sale}&&categories=${categories}`)
  }
  detailsProdact(id: any) {
    return this.http.get(`${environment.url}/prodact/getDetails/${id}`)

  }
  getProdactsByCAtegory(id: any) {
    return this.http.get(`${environment.url}/prodact/getByCategory?id=${id}`)

  }
  getAllOrders() {
    return this.http.get(`${environment.url}/orders`)
  }
  getAllSubCatg() {
    return this.http.get(`${environment.url}/subcategories/get`)

  }
  getAllSubCatgByIdCategories(id: any) {
    return this.http.get(`${environment.url}/subcategories/get/${id}`)

  }
  getAllCategory() {
    return this.http.get(`${environment.url}/categories/get`)

  }
  getSubCategoryByIdCategory(id: any) {
    return this.http.get(`${environment.url}/subcategories/IdCategory/${id}`)

  }
  addOrder(dataOrder: IOrder) {
    return this.http.post(`${environment.url}/orders/add`, dataOrder)

  }
  myInfromtion() {
    return this.http.get(`${environment.url}/me`,)

  }
  updateMyInformtion(data: IUpdateUser) {
    return this.http.put(`${environment.url}/me/update`, data)

  }
  activateEmail(token: any) {
    return this.http.get(`${environment.url}/activate/${token}`)

  }
  resendEmail(data: IResend) {
    return this.http.post(`${environment.url}/resendMessage/`, data)

  }
  changeEmail(data: IchangeEmail) {
    return this.http.put(`${environment.url}/me/changEmail`, data)

  }
  changPassword(data: any) {
    return this.http.put(`${environment.url}/me/change-password`, data)

  }
  forgetPassword(data: IResend) {
    return this.http.put(`${environment.url}/forget-password`, data)
  }
  reastPassword(data: any, token: any) {
    return this.http.put(`${environment.url}/reset-password/${token}`, data)
  }
  cahngeImge(img) {
    return this.http.put(`${environment.url}/me/avatar`, img)

  }
  myOrders() {
    return this.http.get(`${environment.url}/orders/OrdersUser`,)

  }
  deleteOrder(data: IDeleteOrder) {
    return this.http.put(`${environment.url}/orders/delete`, data)

  }
  BuyOrder(data: IDeleteOrder) {
    return this.http.put(`${environment.url}/orders/buyDone`, data)

  }
  deleteAllOrders() {
    return this.http.delete(`${environment.url}/orders/deleteAll`,)
  }
  checkOut(data: any) {
    return this.http.post(`${environment.url}/checkout`, data)
  }
  checWalt(data: any) {
    return this.http.post(`${environment.url}/checkout/walt`, data)
  }
  orderDetails(id: any) {
    return this.http.get(`${environment.url}/orders/orderDetails/${id}`)
  }
  checkoutSuccess(session_id: any) {
    return this.http.get(`${environment.url}/checkout/my-order/succsess?session_id=${session_id}`)
  }
  addWalt(data: IAddWalt) {
    return this.http.put(`${environment.url}/walt`, data)
  }
  buyFromWalt(data: any) {
    return this.http.put(`${environment.url}/buyWalt`, data)
  }
}
