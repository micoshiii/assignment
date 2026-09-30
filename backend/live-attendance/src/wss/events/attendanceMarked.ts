import { isClassDeclaration } from "typescript";
import { ClassModel } from "../../models/class.model";
import { activeSession } from "../../store/activeSession.store";
import { WsError } from "../../utils/Ws.Error";
import type { CustomWebSocket } from "../ws";
import { WsMessage } from "../../utils/WsMessage";
import { broadcast } from "../../utils/broadcast";
import type { WebSocketServer } from "ws";

export const handleAttendanceMarked = async(data:any , ws:CustomWebSocket , wss:WebSocketServer )=>{
    const { studentId , status } = data;

    if(!studentId || !status){
       ws.send(JSON.stringify(new WsError("Invalid payload"))); 
       return; 
    }

    if(ws.user.role !== "teacher"){
        ws.send(JSON.stringify(new WsError("Forbidden, teacher event only")));
        ws.close();
        return;
    };

    if(!activeSession.classId){
        ws.send(JSON.stringify(new WsError("No active attendance session"))); 
        return;
    };

    const existingClass = await ClassModel.findById(activeSession.classId);

    if(!existingClass || existingClass.teacherId?.toString() !== ws.user.id){
     ws.send(JSON.stringify(new WsError("No active attendance session"))); 
    return;   
    }

    activeSession.attendance[studentId] = status;   //[] implies to redirect to a specific key
    
    const message = new WsMessage("ATTENDANCE_MARKED", { studentId, status });

    broadcast(wss , ws , message);
}



