<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\TeamMemberResource;
use App\Models\TeamMember;
use Illuminate\Http\Request;

class AdminTeamMemberController extends Controller
{
    public function index()
    {
        $teamMembers = TeamMember::latest()->get();

        return TeamMemberResource::collection($teamMembers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'occupation' => ['required', 'string', 'max:255'],
        ]);

        $teamMember = TeamMember::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Team member created successfully',
            'data' => new TeamMemberResource($teamMember),
        ], 201);
    }

    public function show(string $id)
    {
        $teamMember = TeamMember::findOrFail($id);

        return new TeamMemberResource($teamMember);
    }

    public function update(Request $request, string $id)
    {
        $teamMember = TeamMember::findOrFail($id);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'occupation' => ['required', 'string', 'max:255'],
        ]);

        $teamMember->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Team member updated successfully',
            'data' => new TeamMemberResource($teamMember),
        ]);
    }

    public function destroy(string $id)
    {
        $teamMember = TeamMember::findOrFail($id);
        $teamMember->delete();

        return response()->json([
            'success' => true,
            'message' => 'Team member deleted successfully',
        ]);
    }
}