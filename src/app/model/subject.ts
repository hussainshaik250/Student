export interface Subject {
    id:string;
    subject_name:string,
    subject_code:string,
    no_of_students:number,
    isclicked?:boolean,
    // is_selected?:boolean,
    user_id?:any;
    selectedSubjects?:string[];
    permission?:boolean;
}
