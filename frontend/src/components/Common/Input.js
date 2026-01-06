export const Input = ({ label, ...props }) => (
    <div className="flex flex-col mb-2">
        <label className="text-sm font-bold">{label}</label>
        <input className="border p-2 rounded" {...props} />
    </div>
);
