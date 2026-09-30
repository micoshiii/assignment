import { ClassModel } from "../../models/class.model";
import { activeSession } from "../../store/activeSession.store";
import { WsError } from "../../utils/Ws.Error";
import { WsMessage } from "../../utils/WsMessage";
import type { CustomWebSocket } from "../ws";

export const myAttendance = async(ws:CustomWebSocket)=>{

    if(ws.user.role !== "student"){
    ws.send(JSON.stringify(new WsError("Forbidden, student event only")));
    ws.close();
    return;
    }

    if(!activeSession.classId){
        ws.send(JSON.stringify(new WsError("No active attendance session")));
    return;
    }

    const existingClass = await ClassModel.findById(activeSession.classId);
    // we gotta check if the student is enrolled in this class or not !!!
    const isEnrolled = existingClass?.studentIds.some(s=>s.toString() === ws.user.id);

    if(!isEnrolled){
    ws.send(JSON.stringify(new WsError("No active attendance session")));
    return;
    }

    //Check whether this student's attendance exists
    if(!activeSession.attendance[ws.user.id]){             // note: activeSession.attendance[ws.user.id] implies absent / present
        ws.send(JSON.stringify(new WsMessage("MY_ATTENDANCE", { status: "not yet updated" })))
        return;
    }

    ws.send(JSON.stringify(new WsMessage("MY_ATTENDANCE", { status : activeSession.attendance[ws.user.id]})))
}
