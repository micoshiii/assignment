import { WebSocketServer } from "ws";
import { server } from "../server";
import url from "url";
import { connection } from "mongoose";
import { WsError } from "../utils/Ws.Error";
import jwt from "jsonwebtoken";
import { WebSocket } from "ws";
import { handleAttendanceMarked } from "./events/attendanceMarked";
import { todaySummary } from "./events/todaySummary";

const wss =new WebSocketServer({
    server ,
    path: "/ws"
});

export interface CustomWebSocket extends WebSocket {
  user: {
    id: string;
    role: "teacher" | "student";
  };
}

wss.on("connection" , (ws: CustomWebSocket , req:Request)=>{
    console.log("WS Server connected...");

    const parsedUrl = url.parse(req.url , true);
    const token = parsedUrl.query.token as string;

    if(!token){
        ws.send(JSON.stringify(new WsError("Unauthorized or invalid token")))
        ws.close();
        return;
    }

    try{
        const decoded = jwt.verify(token , "secret") as {
            id: string;
            role: "teacher" | "student"
        }

        ws.user = {id:decoded.id , role:decoded.role}

    }catch(err){
        ws.send(JSON.stringify(new WsError("Unauthorized or invalid token")))
        ws.close();
        return;
    }

    ws.on("message" , async (raw)=>{
        try{
            var parsed = JSON.parse(raw.toString());  //converted raw to json(string) and then parsed it to get js object.
        }catch(err){
            ws.send(JSON.stringify(new WsError("Invalid message format")));
            return;
        }

        const { event , data } = parsed;

        switch (event) {
            case "ATTENDANCE_MARKED":
               handleAttendanceMarked(data , ws , wss) 
            break;

            case "TODAY_SUMMARY":
                todaySummary( wss , ws)
                break;
        }
    })


});


