export interface ResponseData<T> {
  message : string,
  data : T,
  status : boolean,
  statusCode:number,
  error:string,
}
