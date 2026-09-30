import type { WebSocketServer } from "ws";
import type { CustomWebSocket } from "../ws";
import { activeSession } from "../../store/activeSession.store";
import { WsError } from "../../utils/Ws.Error";
import { ClassModel } from "../../models/class.model";
import { AttendanceModel } from "../../models/attendance.model";
import { broadcast } from "../../utils/broadcast";
import { WsMessage } from "../../utils/WsMessage";

export const done = async(ws:CustomWebSocket , wss:WebSocketServer)=>{

    if (ws.user.role !== "teacher") {
    ws.send(JSON.stringify(new WsError("Forbidden, teacher event only")));
    ws.close();
    return;
  }

  if (!activeSession.classId) {
    ws.send(JSON.stringify(new WsError("No active attendance session")));
    return;
  }

  const existingClass = await ClassModel.findById(activeSession.classId);

  if (!existingClass) {
    ws.send(JSON.stringify(new WsError("Class not found")));
    return;
  }

  if (existingClass.teacherId?.toString() !== ws.user.id) {
    ws.send(JSON.stringify(new WsError("No active attendance session")));
    return;
  }

  const finalAttendance: Record<string, "present" | "absent"> = {};
  existingClass.studentIds.forEach((studentId) => {
    const idStr = studentId.toString();
    finalAttendance[idStr] = activeSession.attendance[idStr] ?? "absent";
  });

  await Promise.all(
    Object.entries(finalAttendance).map(([studentId, status]) =>
      AttendanceModel.findOneAndUpdate(
        { classId: activeSession.classId, studentId },
        { classId: activeSession.classId, studentId, status },
        { upsert: true, new: true },
      ),
    ),
  );

  const values = Object.values(finalAttendance);
  const present = values.filter((s)=> s === "present").length;
  const absent = values.filter((s)=> s === "absent").length;
  const total = present + absent;

  const message = new WsMessage ("DONE", {
    message: "Attendance persisted",
    present,
    absent,
    total,
  });

     broadcast (wss, ws, message);

  activeSession.classId = null;
  activeSession.startedAt = null;
  activeSession.attendance = {};
};

