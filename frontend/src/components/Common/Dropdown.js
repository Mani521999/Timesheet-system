export const Dropdown = ({ label, options, ...props }) => (
    <div className="flex flex-col mb-2">
        <label className="text-sm font-bold">{label}</label>
        <select className="border p-2 rounded" {...props}>
            <option value="">Select</option>
            {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
    </div>
);
