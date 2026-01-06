export const EditableGrid = ({ data }) => (
    <table className="w-full border mt-4 text-left">
        <thead className="bg-blue-100">
            <tr><th>Name</th><th>Company</th><th>Punch In</th><th>Punch Out</th><th>Hours</th><th>Date</th></tr>
        </thead>
        <tbody>
            {data.map((row, i) => (
                <tr key={i} className="border-b">
                    <td>{row.name}</td><td>{row.companyName}</td><td>{row.punchIn}</td>
                    <td>{row.punchOut}</td><td>{row.totalHours}</td><td>{row.date?.split('T')[0]}</td>
                </tr>
            ))}
        </tbody>
    </table>
);
