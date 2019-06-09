
export interface IMessageResult {
    channel: string,
    ts: string
  }
  
  export interface ISlackApi {
    chat: IChatEndPoint;
  }
  
  export interface IChatEndPoint
  {
    update: (data: any) => Promise<IMessageResult>,
    postMessage: (data: any) => Promise<IMessageResult>
  }