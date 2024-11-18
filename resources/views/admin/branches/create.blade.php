@extends('admin.master')
@section('title', __('Create Branch'))
@section('content')
<style>
    table,
    th,
    td {
        border: 1px solid #ddd;
    }

    th,
    td {
        padding: 10px;
        text-align: left;
    }

    th {
        background-color: #f4f4f4;
    }
</style>
<div class="page-content">
    <div class="d-flex justify-content-between align-items-center flex-wrap grid-margin">
        <div class="d-flex align-items-baseline gap-2">
            <a href="{{ route('admin.branches') }}"><i class="fa fa-chevron-left" aria-hidden="true"></i></a>
            <h3 class="mb-3 mb-md-0">Create Branch</h3>
        </div>
    </div>
    <div class="card shadow-sm mx-auto">
        <form action="{{ route('admin.branch.store') }}" method="POST" class="card-body row">
            @csrf
            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Name</label>
                <div class="form-group">
                    <input type="text" name="name" class="form-control" placeholder="Branch Name">
                </div>
            </div>

            <div class="col-6 col-md-12 col-xl-6 mb-2">
                <label class="mb-1" for="name">Branch Location</label>
                <div class="form-group">
                    <input type="text" name="location" class="form-control" placeholder="Branch Location">
                </div>
            </div>
            <!--  -->
            <div>
                <table id="floorsTable" class="col-md-12 col-xl-12 mb-3">
                    <thead>
                        <tr>
                            <th>Floor</th>
                            <th>Rooms</th>
                            <th>Details</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Dynamic floor rows will be added here -->
                    </tbody>
                </table>
                <a class="btn-secondary cursor-pointer" onclick="addFloor()">
                    <i class="fa fa-plus"></i>
                </a>
            </div>
            <!--  -->
            <div class="col-6 col-md-12 col-xl-6 mb-2 d-flex align-items-end gap-5 mt-3">
                <label for="name">Status</label>
                <div class="checkbox-wrapper-3 form-group">
                    <input type="checkbox" id="cbx-3" name="status" value="1">
                    <label for="cbx-3" class="toggle"><span></span></label>
                </div>
            </div>
            <div class="d-flex justify-content-center mt-4">
                <a href="{{ route('dashboard') }}" class="btn-secondary me-2">Cancel</a>
                <button type="submit" class="btn-success">Submit</button>
            </div>
        </form>
        <!-- SweetAlert trigger -->
        @if (session('error'))
        <script>
            showToast('error', '{{ session('error') }}', '#f8d7da');
        </script>
        @endif
    </div>
</div>

<script>
    const floorsTable = document.getElementById("floorsTable").querySelector("tbody");

    // Function to dynamically add a floor row
    function addFloor() {
        const row = document.createElement("tr");

        row.innerHTML = `
    <td><input type="text" class="form-control" placeholder="Floor"></td>
    <td><input type="number" class="form-control" placeholder="Rooms"></td>
    <td>
        <table class="nested-table">
            <thead>
                <tr>
                    <th>Room</th>
                    <th>Type</th>
                    <th>Tables and Chairs</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><input type="text" class="form-control" placeholder="Name"></td>
                    <td><input type="text" class="form-control" placeholder="Type"></td>

                    <td>
                        
                            <div class="table-chair-pair">
                                <input type="number" class="form-control" placeholder="Tables">
                                <input type="number" class="form-control" placeholder="Chairs">
                            </div>
                      
                        <a class="badge bg-warning cursor-pointer" onclick="addTableChairPair(this)">Add Table</a>
                    </td>
                    <td>
                    <a class="badge bg-danger cursor-pointer" onclick="deleteRoomRow(this)">Delete Room</a></td>
                </tr>
            </tbody>
        </table>
        <a class="badge bg-warning cursor-pointer" onclick="addRoomRow(this)">Add Room</a>
    </td>
    <td>
    <a class="badge bg-danger cursor-pointer" onclick="deleteRow(this)">Delete Floor</a>
    </td>
`;
        floorsTable.appendChild(row);
    }

    // Function to add a new room row in the nested table
    function addRoomRow(anchor) {
        const nestedTable = anchor.previousElementSibling.querySelector("tbody");
        const row = document.createElement("tr");

        row.innerHTML = `
    <td><input type="text" class="form-control" placeholder="Room name"></td>
    <td><input type="text" class="form-control" placeholder="Room Type"></td>
    <td>
        
            <div class="table-chair-pair">
                <input type="number" class="form-control" placeholder="Tables">
                <input type="number" class="form-control" placeholder="Chairs">
            </div>
       
        <a class="badge bg-warning cursor-pointer" onclick="addTableChairPair(this)">Add Table</a>
    </td>
    <td><a class="badge bg-danger cursor-pointer" onclick="deleteRoomRow(this)">Delete Room</a></td>
`;
        nestedTable.appendChild(row);
    }

    // Function to add a new table-chair pair
    function addTableChairPair(anchor) {
        const container = anchor.previousElementSibling;
        const pair = document.createElement("div");
        pair.className = "table-chair-pair";

        pair.innerHTML = `
    <input type="number" class="form-control" placeholder="Tables">
    <input type="number" class="form-control" placeholder="Chairs">
    <a class="badge bg-danger cursor-pointer" onclick="deleteTableChairPair(this)">Delete</a>
`;
        container.appendChild(pair);
    }

    // Function to delete a table-chair pair
    function deleteTableChairPair(anchor) {
        const pair = anchor.closest(".table-chair-pair");
        pair.remove();
    }

    // Function to delete a room row
    function deleteRoomRow(anchor) {
        const row = anchor.closest("tr");
        row.remove();
    }

    // Function to delete a floor row
    function deleteRow(anchor) {
        const row = anchor.closest("tr");
        row.remove();
    }
</script>

@endsection