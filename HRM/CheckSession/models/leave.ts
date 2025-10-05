import mongoose from 'mongoose';

const leaveSchema  = new mongoose.Schema({
  eid :{ type : Number , unique :true , required: true },
  name:{ type:String , required:true},
  from:{ type:Date , required:true},
  to:{ type:Date , required:true},
  reason:{ type:String , required:true},
  handledBy:{ type:String , required:true },  // eid ? objectId 
  status:{ type:String , enum :['Accepted' , 'Rejected' , 'Pending'] , required:true , default:"Pending"}
  
}, { timestamps: true });

export const LeaveModel = mongoose.model('Leave', leaveSchema); 