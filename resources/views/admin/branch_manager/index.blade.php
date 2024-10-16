@extends('admin.master')
@section('title', __('Branch Manager'))
@section('content')
    <div class="page-content">
        <form>
            @csrf
            <label for="">Name</label>
            <input type="text" name="name" placeholder="Branch Name">
            <label for="">Email</label>
            <input type="text" name="location" placeholder="Branch Location">
            <label for="">Password</label>
            <input type="password">
            <label for="">Address</label>
            <input type="text" name="address" placeholder="Address">
            <label for="">Role</label>
            <select>
                <option>Branch Manger</option>
                <option>Member</option>
                <option>Investor</option>
            </select>
            <label for="">Branches</label>
            <select>
                <option>Johar Town</option>
                <option>Garden Town</option>
                <option>Model Town</option>
            </select>
            <button class="btn btn-success">Submit</button>
            <button class="btn btn-warning">Cancel</button>
        </form>
    </div>

@endsection
