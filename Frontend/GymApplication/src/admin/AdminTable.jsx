import React, { useState } from 'react'
import DataTable from 'react-data-table-component'

function AdminTable() {

    const [records, setRecords] = useState([
        { id: 1, name: "Mohan", email: "mohan@gmail.com", age: '24' },
        { id: 2, name: "Riti", email: "riti@gmail.com", age: '25' },
        { id: 3, name: "Jones", email: "jones@gmail.com", age: '26' },
        { id: 4, name: "Adam", email: "adam@gmail.com", age: '27' }
    ])

    const [editRecords, setEditRecords] = useState(null)
    const [editData, setEditData] = useState({id:'', name:'', email:'',age:''})


    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true

        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Age',
            selector: row => row.age,
            sortable: true
        },
        {
          name:"Actions",
          cell: row=>(
            <div>
                <button className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-3 py-2 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 cursor-pointer mt-1"
                onClick={()=>handleEdit(row)}>
                    Edit
                </button>
                <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-2 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"
                onClick={()=>handleDelete(row.id)}>
                    Delete
                </button>
            </div>
          )  
        }
    ]

 
    const handleFilter = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const newData = data.filter(row => {
            return row.name.toLowerCase().includes(searchTerm);
        })
        setRecords(newData);
    }

    //DeleteFunction
    const handleDelete = (id)=>{
        const updateRecords = records.filter(row =>row.id !== id);
        setRecords(updateRecords)
    }

    //EditFunciton
    const handleEdit=(row)=>{
        setEditRecords(row.id);
        setEditData(row)
    }

    // save update data
    const handleSave=()=>{
        const updatedRecords = records.map(row=>(row.id === editRecords ? editData :row))
        setRecords(updatedRecords);
        setEditRecords(null)
    }


    return (
        <>
            <div className='container mt-5 border bg-white'>
                <div className='text-end mt-2'>
                    <input className='py-2 px-3 border border-black-200 mr-5'
                    type="text"
                    placeholder='search here....'
                    onChange={handleFilter}
                    />
                </div>
                <DataTable
                    columns={columns}
                    data={records}
                    selectableRows
                    fixedHeader
                    pagination
                />
            </div>

            {/* edit records */}
            {editRecords && (
                    <div className="mt-5 p-4 bg-white rounded-lg">
                        <h3 className="text-lg font-semibold mb-2">Edit Record</h3>
                        <input
                            className="border p-2 rounded-md mr-2"
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        />
                        <input
                            className="border p-2 rounded-md mr-2"
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        />
                        <input
                            className="border p-2 rounded-md mr-2"
                            type="number"
                            value={editData.age}
                            onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                        />
                        <button
                            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                        <button
                            className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 cursor-pointer"
                            onClick={() => setEditRecords(null)}
                        >
                            Cancel
                        </button>
                    </div>
                )}
        </>
    )
}

export default AdminTable
