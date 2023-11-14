// pages/todos.js

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/auth'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import axios from '@/lib/axios'

export default function TodosPage() {
    const { user } = useAuth({ middleware: 'auth' })

    const [softDeletedTasks, setSoftDeletedTasks] = useState([])

    const fetchSoftDeletedTasks = async () => {
        try {
            const token = localStorage.getItem('authToken')
            if (!token) {
                console.error('No authentication token found.')
                return
            }

            const response = await axios.get('/api/archive', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            console.log('API Response (Soft Deleted Tasks):', response.data)

            setSoftDeletedTasks(response.data.tasks)
        } catch (error) {
            console.error('Error fetching soft-deleted tasks:', error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user) {
                    const defaultSort = 'created_at'
                    // await fetchTasks(defaultSort)
                    await fetchSoftDeletedTasks()
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [user])

    const handlePermanentDelete = async taskId => {
        console.log(taskId)
        try {
            // Make a DELETE request to the API endpoint for deleting a task
            await axios.delete(`/api/archive/${taskId}`)

            // Update the state to reflect the deleted task
            setSoftDeletedTasks(prevTasks =>
                prevTasks.filter(task => task.id !== taskId),
            )
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    return (
        <AppLayout>
            <Head>
                <title>Demo - Task Archive</title>
            </Head>
            <div className="w-full max-w-3xl">
                <h1 className="text-3xl font-bold mb-4">Archived Tasks</h1>
                <ul>
                    {softDeletedTasks.map(task => (
                        <li
                            key={task.id}
                            className="bg-gray-150 mb-2 border p-2 rounded">
                            <div>{task.title}</div>
                            <div className="flex space-x-2">
                                <button
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-3 rounded"
                                    onClick={() =>
                                        handlePermanentDelete(task.id)
                                    }>
                                    Permanent Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AppLayout>
    )
}
