<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        // Default order by created_at in ascending order
        $orderBy = $request->input('orderBy', 'created_at');
        $orderDirection = $request->input('orderDirection', 'asc');

        // Validate the orderBy parameter to prevent SQL injection
        $allowedOrderBy = ['created_at', 'title', 'due_date']; // Add more if needed

        $validator = \Validator::make(['orderBy' => $orderBy], [
            'orderBy' => 'regex:/^[a-zA-Z_]+$/',
        ]);

        if ($validator->fails() || !in_array($orderBy, $allowedOrderBy)) {
            return response()->json(['error' => 'Invalid orderBy parameter'], 400);
        }

        // Retrieve tasks based on sorting parameters
        $tasks = Task::orderBy($orderBy, $orderDirection)->get();

        return response()->json(['tasks' => $tasks]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            // 'status' => 'required|string|in:Todo,In Progress,Completed',
            'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048', // adjust file types and size as needed
            'sub_tasks' => 'json|nullable',
            'parent_task_id' => 'exists:tasks,id',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('tasks', 'public');
        }

        $task = Task::create([
            'title' => $request->title,
            'status' => $request->status,
            'image' => $imagePath,
            'sub_tasks' => json_decode($request->sub_tasks, true),
        ]);

        return response()->json($task, 201);

    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Task $task)
    {
        // return response()->json($request->all());
        $request->validate([
            'title' => 'required|string|max:255',
            'status' => 'required|in:Todo,In Progress,Completed',
        ]);

        $task->update([
            'title' => $request->title,
            'status' => $request->status,
        ]);

        return response()->json(['task' => $task, 'message' => 'Task updated successfully']);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(['message' => 'Task moved to trash']);
    }
}
