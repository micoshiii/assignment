export interface ActiveSession {
    classId : string | null ;
    startedAt : string | null ;
    attendance: Record<string , "present" | "absent">
};

export const activeSession : ActiveSession = {
    classId :null ,
    startedAt : null ,
    attendance: {}
};