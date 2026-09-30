import type { WebSocketServer } from "ws";
import type { WebSocket } from "ws";

import type { CustomWebSocket } from "../ws";
import { WsError } from "../../utils/Ws.Error";
import { activeSession } from "../../store/activeSession.store";
import { ClassModel } from "../../models/class.model";
import { WsMessage } from "../../utils/WsMessage";
import { broadcast } from "../../utils/broadcast";

export const todaySummary = async ( wss:WebSocketServer , ws:CustomWebSocket)=>{
    
    if(ws.user.role !== "teacher"){
        ws.send(JSON.stringify(new WsError("Forbidden, teacher event only")));
        ws.close();
        return;
    };

    if (!activeSession.classId) {
    ws.send(JSON.stringify(new WsError("No active attendance session")));
    return;
  }

  const existingClass = await ClassModel.findById(activeSession.classId);

  if (!existingClass || existingClass.teacherId?.toString() !== ws.user.id) {
    ws.send(JSON.stringify(new WsError("No active attendance session")));
    return;
  }

  const array = Object.values(activeSession.attendance);

  const present = array.filter((a)=> a == "present").length;

  const absent = array.filter((a)=> a ==  "absent").length;

 const total = absent + present;

   const message = new WsMessage("TODAY_SUMMARY" , {present , absent , total} );

   broadcast(wss , ws , message);

}