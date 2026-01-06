import { getToday } from '../../utils/dateHelpers';
export const DatePicker = ({ label, ...props }) => (
    <div className="flex flex-col mb-2">
        <label className="text-sm font-bold">{label}</label>
        <input type="date" max={getToday()} className="border p-2 rounded" {...props} />
    </div>
);
