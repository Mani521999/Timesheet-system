import { DatePicker } from "../Common/DatePicker";
import { Dropdown } from "../Common/Dropdown";


export const FilterBar = ({ filters, setFilters, onDownload }) => (
    <div className="flex gap-4 items-end bg-gray-50 p-4 rounded mb-4">
        <Dropdown label="Name" options={['Employee 1', 'Employee 2']} onChange={e => setFilters({...filters, name: e.target.value})} />
        <DatePicker label="From" onChange={e => setFilters({...filters, startDate: e.target.value})} />
        <DatePicker label="To" onChange={e => setFilters({...filters, endDate: e.target.value})} />
        {/* <button onClick={onDownload} className="bg-green-600 text-white p-2 rounded h-10">Export Excel</button> */}
    </div>
);
