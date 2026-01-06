import mongoose from 'mongoose';

const TimesheetSchema = new mongoose.Schema({
    name: { type: String, required: true },
    companyName: { type: String, required: true },
    date: { type: Date, required: true },
    punchIn: { type: String, required: true },
    punchOut: { type: String, required: true },
    totalHours: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Timesheet', TimesheetSchema);