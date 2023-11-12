<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Task;
class SubTask extends Model
{
    use HasFactory;
    protected $guarded = [];

    public function parentTask()
    {
        return $this->belongsTo(Task::class, 'parent_task_id');
    }
}
