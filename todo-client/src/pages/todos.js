// pages/todos.js

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from '@/lib/axios'
import { AiOutlineDelete } from 'react-icons/ai'
import { FiArchive } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import Link from 'next/link'

export default function TodosPage() {
    const { user } = useAuth({ middleware: 'auth' })
    const [tasks, setTasks] = useState([])
    const [todoInput, setTodoInput] = useState('')
    const [selectedStatus, setSelectedStatus] = useState('')
    const [selectedSort, setSelectedSort] = useState('created_at')
    const [searchInput, setSearchInput] = useState('')

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('No authentication token found.')
                return
            }

            console.log('Fetching tasks with sorting:', selectedSort)

            // Remove the '-' character if present at the beginning
            const orderByField = selectedSort.startsWith('-')
                ? selectedSort.slice(1)
                : selectedSort

            const response = await axios.get('/api/task', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    orderBy: orderByField,
                    orderDirection: selectedSort.startsWith('-')
                        ? 'desc'
                        : 'asc',
                    search: searchInput,
                },
            })

            console.log('API Response:', response.data)

            setTasks(response.data.tasks)
        } catch (error) {
            console.error('Error fetching tasks:', error)
        }
    }

    useEffect(() => {
        const fetchDefaultData = async () => {
            try {
                if (user) {
                    // Provide a default sorting option, e.g., by date created
                    const defaultSort = 'created_at'
                    await fetchTasks(defaultSort)
                }
            } catch (error) {
                console.error('Error fetching default data:', error)
            }
        }

        fetchDefaultData()
    }, [user])

    const handleEditTask = async (taskId, newTitle, status) => {
        console.log(status)
        try {
            // Update the task on the server
            await axios.put(`/api/task/${taskId}`, {
                title: newTitle,
                status: status,
            })

            // Fetch the updated tasks after editing
            await fetchTasks()
        } catch (error) {
            console.error('Error editing task:', error.response.data.message)
        }
    }

    const handleTaskClick = taskId => {
        const taskToEdit = tasks.find(task => task.id === taskId)
        if (taskToEdit) {
            setTasks(prevTasks =>
                prevTasks.map(prevTask =>
                    prevTask.id === taskId
                        ? { ...prevTask, isEditing: true }
                        : { ...prevTask, isEditing: false },
                ),
            )
            setSelectedStatus(taskToEdit.status)
        }
    }

    const handleDelete = async taskId => {
        try {
            // Make a DELETE request to the API endpoint for deleting a task
            await axios.delete(`/api/task/${taskId}`)

            // Update the state to reflect the deleted task
            setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    const columns = {
        todo: 'Todo',
        inProgress: 'In Progress',
        completed: 'Completed',
    }

    const getColumnTasks = column => {
        const normalizedColumn =
            column.charAt(0).toLowerCase() + column.slice(1).replace(/\s+/g, '')

        const columnTasks = tasks
            .map(task => ({
                ...task,
                status:
                    task.status.charAt(0).toLowerCase() +
                    task.status.slice(1).replace(/\s+/g, ''),
            }))
            .filter(task => task.status === normalizedColumn)
            .filter(task =>
                task.title.toLowerCase().includes(searchInput.toLowerCase()),
            )
        return columnTasks
    }

    return (
        <AppLayout>
            <Head>
                <title>Demo - Task Board</title>
            </Head>

            <div className="mr-auto">
                <Tooltip id="my-tooltip" />
                <Link
                    href="/archive"
                    className="underline text-sm text-gray-600
                    hover:text-gray-900">
                    <FiArchive
                        className="inline-block mr-2 text-2xl text-blue-500"
                        size={40}
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Archive"
                    />
                </Link>
            </div>
            <div className="flex items-center justify-center h-screen">
                <div className="w-full max-w-3xl">
                    <input
                        id="todoInput"
                        className="w-full py-2 px-3 border rounded shadow mb-4"
                        type="text"
                        placeholder="Add a new task..."
                        value={todoInput}
                        onChange={e => setTodoInput(e.target.value)}
                    />

                    <button
                        className=" mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={async () => {
                            if (todoInput.trim() !== '') {
                                await axios.post('/api/task', {
                                    title: todoInput,
                                    status: 'todo',
                                })

                                await fetchTasks()

                                setTodoInput('')
                            }
                        }}>
                        Add Task
                    </button>
                    <div
                        className="mb-4 relative"
                        style={{ textAlign: 'center' }}>
                        <input
                            id="searchInput"
                            className="w-full py-2 px-3 border rounded shadow mb-4"
                            type="text"
                            placeholder="Search tasks..."
                            value={searchInput}
                            onChange={e => setSearchInput(e.target.value)}
                        />
                    </div>
                    {/* Add the sorting buttons here */}
                    <div className="mb-2" style={{ textAlign: 'center' }}>
                        <button
                            className={`mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${selectedSort === 'created_at'
                                    ? 'opacity-50'
                                    : ''
                                }`}
                            onClick={() => {
                                setSelectedSort('created_at')
                                fetchTasks()
                            }}
                            disabled={selectedSort === 'created_at'} // Disable if already selected
                        >
                            Sort Ascending ▲
                        </button>
                        <button
                            className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${selectedSort === '-created_at'
                                    ? 'opacity-50'
                                    : ''
                                }`}
                            onClick={() => {
                                setSelectedSort('-created_at')
                                fetchTasks()
                            }}
                            disabled={selectedSort === '-created_at'} // Disable if already selected
                        >
                            Sort Descending ▼
                        </button>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                        {Object.keys(columns).map(column => (
                            <div
                                key={column}
                                className="bg-gray-100 p-4 rounded border border-gray-300">
                                <h2 className="text-lg font-bold mb-2">
                                    {columns[column]}
                                </h2>
                                <ul>
                                    {getColumnTasks(column).map(task => (
                                        <li
                                            key={task.id}
                                            className="bg-gray-150 mb-2 border p-2 rounded bg-gray-200">
                                            {task.isEditing ? (
                                                <div className="mb-2">
                                                    <input
                                                        type="text"
                                                        value={task.title}
                                                        onChange={e =>
                                                            setTasks(
                                                                prevTasks =>
                                                                    prevTasks.map(
                                                                        prevTask =>
                                                                            prevTask.id ===
                                                                                task.id
                                                                                ? {
                                                                                    ...prevTask,
                                                                                    title:
                                                                                        e
                                                                                            .target
                                                                                            .value,
                                                                                }
                                                                                : prevTask,
                                                                    ),
                                                            )
                                                        }
                                                        className="mb-2 max-w-full overflow-hidden"
                                                    />

                                                    <select
                                                        value={selectedStatus}
                                                        onChange={e =>
                                                            setSelectedStatus(
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="mb-2">
                                                        {Object.keys(
                                                            columns,
                                                        ).map(col => (
                                                            <option
                                                                key={col}
                                                                value={
                                                                    columns[col]
                                                                }>
                                                                {columns[col]}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div
                                                        style={{
                                                            textAlign: 'center',
                                                            display: 'grid',
                                                            gridTemplateColumns:
                                                                'repeat(3, 1fr)',
                                                        }}>
                                                        <button
                                                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-3 rounded"
                                                            onClick={() =>
                                                                handleEditTask(
                                                                    task.id,
                                                                    task.title,
                                                                    selectedStatus,
                                                                )
                                                            }>
                                                            Save
                                                        </button>
                                                        <button
                                                            className="ml-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded"
                                                            onClick={() =>
                                                                setTasks(
                                                                    prevTasks =>
                                                                        prevTasks.map(
                                                                            prevTask =>
                                                                                prevTask.id ===
                                                                                    task.id
                                                                                    ? {
                                                                                        ...prevTask,
                                                                                        isEditing: false,
                                                                                    }
                                                                                    : prevTask,
                                                                        ),
                                                                )
                                                            }>
                                                            Cancel
                                                        </button>
                                                        <button
                                                            className="ml-1 bg-yellow-500 hover:bg-yellow-700 text-red font-bold py-2 px-3 rounded"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    task.id,
                                                                )
                                                            }>
                                                            {/* Delete */}
                                                            <AiOutlineDelete
                                                                size={30}
                                                            />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() =>
                                                        handleTaskClick(
                                                            task.id,
                                                            task.status,
                                                        )
                                                    }
                                                    className="cursor-pointe">
                                                    {task.title}
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
